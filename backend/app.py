from flask import Flask,request,jsonify, session
import pandas as pd
from flask_bcrypt import Bcrypt #pip install Flask-Bcrypt = https://pypi.org/project/Flask-Bcrypt/
from flask_cors import CORS, cross_origin #ModuleNotFoundError: No module named 'flask_cors' = pip install Flask-Cors
from models import db, User, UserPreference
from urllib.parse import unquote
import pickle
import urllib.parse

popular_df=pickle.load(open('popular.pkl','rb'))
movienew_df=pickle.load(open('movienew.pkl','rb'))
similarity_df=pickle.load(open('similarity.pkl','rb'))

app=Flask(__name__)

app.config['SECRET_KEY'] = 'movie-bollywood'
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///flaskprojectdb.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Fixed the config key
app.config['SQLALCHEMY_ECHO'] = True

bcrypt = Bcrypt(app) 
CORS(app, supports_credentials=True)
db.init_app(app)
  
with app.app_context():
    db.create_all()
def get_movie_info(movienew_df, title):
    title = unquote(title)
    print('Received title:', title)
    title_lower = title.lower().strip()
    print('Searching for:', title_lower)
    
    # Perform a case-insensitive search that allows partial matches
    movie_info = movienew_df[movienew_df['title'].str.lower().str.contains(title_lower, na=False)]
    
    print('Movie info found:', movie_info)
    
    if movie_info.empty:
        print("No matching movie found for title:", title_lower)
        return None  # Return None if no matching title is found
    
    # Extract the first matching movie's details
    movie_details = {
        'title': movie_info['title'].values[0],
        'imdb_rating': movie_info['imdb_rating'].values[0],
        'poster_path': movie_info['poster_path'].values[0],
        'genres': movie_info['genres'].values[0],
        'summary': movie_info['summary'].values[0],
        'actors': movie_info['actors'].values[0],
    }
    
    print('Returning movie details:', movie_details)
    
    return movie_details


@app.route("/moviedetail/<title>", methods=["GET"])
def get_movie(title):
    print("Received title:", title)  # Log the received title
    movie_details = get_movie_info(movienew_df, title)
    print("Movie-details:",movie_details)
    
    if movie_details is None:
        return jsonify({"error": "Movie not found"}), 404
    
    return jsonify(movie_details)

@app.route("/save_preferences", methods=["POST"])
def save_preferences():
    user_id = session.get('user_id')  # Get the logged-in user's ID from the session
    if not user_id:
        return jsonify({"error": "User not logged in"}), 401
    
    user = User.query.get(user_id)  # Fetch the specific user by ID
    if user:
        # Get selected genres and actors from the request
        selected_genres = request.json.get('selected_genres', [])
        selected_actors = request.json.get('selected_actors', [])

        # Convert lists to comma-separated strings
        genres_str = ','.join(selected_genres)
        actors_str = ','.join(selected_actors)

        # Create a new UserPreference entry
        preference = UserPreference(
            user_id=user.id,
            selected_genres=genres_str,
            selected_actors=actors_str
        )

        # Add the preference to the session and commit it to the database
        db.session.add(preference)
        db.session.commit()

        return jsonify({"message": f"Preferences added for user: {user.name}"})
    else:
        return jsonify({"error": "User not found"}), 404


def recommend_movies(popular_df, selected_genres=None, selected_actors=None, top_n=None):
    # Check if DataFrame is empty or columns are missing
    if popular_df.empty or 'imdb_rating' not in popular_df.columns:
        return pd.DataFrame()
    
    filtered_df=popular_df.copy()
    filtered_df1=popular_df.copy()

    # Filter by selected genres
    if selected_genres:
        filtered_df = filtered_df[filtered_df['genres'].apply(lambda x: any(genre.lower() in (g.strip().lower() for g in str(x).split(',')) for genre in selected_genres))]

    # # Filter by selected actors
    if selected_actors:
        filtered_df = filtered_df[filtered_df['actors_normalized'].apply(lambda x: any(all(part.lower() in x.lower() for part in actor.split()) for actor in selected_actors))]

    if filtered_df.empty:
        filtered_df1=filtered_df1.sort_values(by='imdb_rating', ascending=False)
        return filtered_df1.head(top_n)
    else:
        # Sort by IMDb rating in descending order
        filtered_df = filtered_df.sort_values(by='imdb_rating', ascending=False)
        return filtered_df.head(top_n)

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.json
    selected_genres = data.get("genres", [])
    selected_actors = data.get("actors", [])
    top_n = data.get("top_n", 5)
    recommended_movies = recommend_movies(popular_df, selected_genres, selected_actors, top_n)
    return jsonify(recommended_movies.to_dict(orient='records'))
    
def recommend_based_actor(actor_name):
    actor_name_normalized = actor_name.replace(" ", "").lower()
    movienew_df['actors_normalized'] = movienew_df['actors'].str.replace(" ", "").str.lower()
    matching_movies = movienew_df[movienew_df['actors_normalized'].str.contains(actor_name_normalized, na=False)]
    
    if matching_movies.empty:
        return []
    
    recommendations = []
    for index, row in matching_movies.iterrows():
        movie_info = [
            [row['title']],
            [row['imdb_rating']],
            [row['poster_path']]
        ]
        recommendations.append(movie_info)
    
    recommendations.sort(key=lambda x: x[1], reverse=True)
    return recommendations

def recommend_based_genre(genre_name):
    genre_name_normalized = genre_name.strip().lower()
    matching_movies = movienew_df[movienew_df['genres'].str.lower().str.contains(genre_name_normalized, case=False, na=False)]
    
    if matching_movies.empty:
        return []
    
    recommendations = []
    for index, row in matching_movies.iterrows():
        movie_info = [
            [row['title']],
            [row['imdb_rating']],
            [row['poster_path']]
        ]
        recommendations.append(movie_info)
    
    recommendations.sort(key=lambda x: x[1], reverse=True)
    return recommendations

def recommend_based_movie(query):
    query_normalized = query.strip().lower()
    movie_titles_normalized = movienew_df['title'].str.lower().str.replace(r'\s*\(.*\)', '', regex=True)
    movie_matches = movienew_df[movie_titles_normalized.str.contains(query_normalized, na=False)]
    
    if movie_matches.empty:
        return []
    
    recommendations = []
    for _, row in movie_matches.iterrows():
        try:
            movie_index = movienew_df[movie_titles_normalized == row['title'].lower()].index[0]
            distances = similarity_df[movie_index]
            movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]
            
            for i in movies_list:
                movie_info = [
                    [movienew_df.iloc[i[0]]['title']],
                    [movienew_df.iloc[i[0]]['imdb_rating']],
                    [movienew_df.iloc[i[0]]['poster_path']]
                ]
                recommendations.append(movie_info)
        except IndexError:
            continue
    
    recommendations.sort(key=lambda x: x[1], reverse=True)
    return recommendations

def combined_movie_recommendation(query):
    query_normalized = query.strip().lower()
    
    if 'actors_normalized' not in movienew_df.columns:
        movienew_df['actors_normalized'] = movienew_df['actors'].str.replace(" ", "").str.lower()

    if query_normalized in movienew_df['title'].str.lower().values:
        return recommend_based_movie(query)[:5]
    elif query_normalized in movienew_df['actors_normalized'].values:
        return recommend_based_actor(query)[:5]
    elif query_normalized in movienew_df['genres'].str.lower().values:
        return recommend_based_genre(query)[:5]

    recommendations = []
    for func in [recommend_based_actor, recommend_based_genre, recommend_based_movie]:
        try:
            recs = func(query_normalized)
            recommendations.extend(recs)
        except:
            pass
    recommendations.sort(key=lambda x: x[1], reverse=True)
    return recommendations[:5]

@app.route("/recommend_by_query", methods=["POST"])
def recommend_by_query():
    data = request.json
    query = data.get("query", "")
    recommendations = combined_movie_recommendation(query)
    return jsonify(recommendations)

def get_movie_info(movienew_df, title):
    title = urllib.parse.unquote(title)  # Decode URL-encoded title
    title = title.lower().strip()  # Normalize title
    movie_info = movienew_df[movienew_df['title'].str.lower().str.strip() == title]
    
    if movie_info.empty:
        return None  # Return None if no matching title is found
    
    movie_details = {
        'title': movie_info['title'].values[0],
        'imdb_rating': movie_info['imdb_rating'].values[0],
        'poster_path': movie_info['poster_path'].values[0],
        'genres': movie_info['genres'].values[0],
        'summary': movie_info['summary'].values[0],
        'actors': movie_info['actors'].values[0],
    }
    
    return movie_details

def get_top_action_movies(top_n=10):
    # Filter movies by 'Action' genre
    action_movies = movienew_df[movienew_df['genres'].str.lower().str.contains('action', case=False, na=False)]
    
    # Sort by IMDb rating in descending order
    sorted_action_movies = action_movies.sort_values(by='imdb_rating', ascending=False)
    
    # Get the top N movies and format them as lists
    top_action_movies = sorted_action_movies.head(top_n)[['title', 'imdb_rating', 'poster_path']].values.tolist()
    
    return top_action_movies

@app.route("/top_action_movies", methods=["GET"])
def top_action_movies():
    # Get the top 5 action movies
    # top_action_movies = get_top_action_movies(top_n=5)
    # return jsonify(top_action_movies)
    try:
        action_movies = get_top_action_movies(top_n=5)
        return jsonify(action_movies)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_top_comedy_movies(top_n=10):
    # Filter movies by 'Action' genre
    comedy_movies = movienew_df[movienew_df['genres'].str.lower().str.contains('comedy', case=False, na=False)]
    
    # Sort by IMDb rating in descending order
    sorted_comedy_movies = comedy_movies.sort_values(by='imdb_rating', ascending=False)
    
    # Get the top N movies and format them as lists
    top_comedy_movies = sorted_comedy_movies.head(top_n)[['title', 'imdb_rating', 'poster_path']].values.tolist()
    
    return top_comedy_movies


@app.route("/top_comedy_movies", methods=["GET"])
def top_comedy_movies():
    try:
        comedy_movies = get_top_comedy_movies(top_n=5)
        return jsonify(comedy_movies)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def get_top_romance_movies(top_n=10):
    # Filter movies by 'Action' genre
    romance_movies = movienew_df[movienew_df['genres'].str.lower().str.contains('romance', case=False, na=False)]
    
    # Sort by IMDb rating in descending order
    sorted_romance_movies = romance_movies.sort_values(by='imdb_rating', ascending=False)
    
    # Get the top N movies and format them as lists
    top_romance_movies = sorted_romance_movies.head(top_n)[['title', 'imdb_rating', 'poster_path']].values.tolist()
    
    return top_romance_movies


@app.route("/top_romance_movies", methods=["GET"])
def top_romance_movies():
    try:
        romance_movies = get_top_romance_movies(top_n=5)
        return jsonify(romance_movies)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_top_thriller_movies(top_n=10):
    # Filter movies by 'Action' genre
    thriller_movies = movienew_df[movienew_df['genres'].str.lower().str.contains('thriller', case=False, na=False)]
    
    # Sort by IMDb rating in descending order
    sorted_thriller_movies = thriller_movies.sort_values(by='imdb_rating', ascending=False)
    
    # Get the top N movies and format them as lists
    top_thriller_movies = sorted_thriller_movies.head(top_n)[['title', 'imdb_rating', 'poster_path']].values.tolist()
    
    return top_thriller_movies


@app.route("/top_thriller_movies", methods=["GET"])
def top_thriller_movies():
    try:
        thriller_movies = get_top_thriller_movies(top_n=5)
        return jsonify(thriller_movies)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/signup", methods=["POST"])
def signup():
    name=request.json["name"]
    email=request.json["email"]
    password=request.json["password"]
    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "Email already exists"}), 409
    
    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(email=email,name=name, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    session['user_id'] = new_user.id

    return jsonify({
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email
    })

@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]
  
    user = User.query.filter_by(email=email).first()
  
    if user is None:
        return jsonify({"error": "Unauthorized Access"}), 401
  
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
      
    session["user_id"] = user.id
  
    return jsonify({
        "id": user.id,
        "email": user.email
    })

@app.route("/logout", methods=["POST"])
def logout_user():
    # Clear the user session
    session.pop("user_id", None)
    return jsonify({"message": "Successfully logged out"})



if __name__=="__main__":
    app.run(debug=True)