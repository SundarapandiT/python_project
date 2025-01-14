

function About() {
    return (
        <div className="about-body">
            <h1>About Emosync - Emotion-Based Music Recommendation System</h1>
            <p>
                Welcome to Emosync, an innovative and interactive music recommendation platform that syncs your emotions with music. 
                Our system uses advanced facial emotion detection technology to analyze your real-time emotions and provide personalized 
                music recommendations, creating a seamless and emotionally-driven music experience.
            </p>

            <h2>Why Emosync?</h2>
            <p>
                Emotions play a significant role in our daily lives, influencing our choices, behaviors, and even the music we listen to. 
                Traditional music recommendation systems rely on user preferences, playlists, or search history, which may not always 
                reflect your current emotional state. Emosync bridges this gap by:
            </p>
            <ul>
                <li>Detecting your facial expressions using TensorFlow.js in the frontend.</li>
                <li>Analyzing your emotions with a Flask backend powered by Machine Learning.</li>
                <li>Recommending songs that align with your mood using the Our App playlist.</li>
            </ul>

            <h2>Future Enhancement</h2>
            <p>
                We are constantly working to improve Emosync and make it a more immersive experience. Here are some future enhancements we plan to implement:
            </p>
            <ul>
                <li><b>Spotify Login:</b> Allow users to log in to their Spotify accounts for more personalized playlists.</li>
                <li><b>Advanced Emotion Analysis:</b> Incorporate more nuanced emotions and combine them with user preferences.</li>
                <li><b>Mobile App Version:</b> Develop a mobile version of Emosync for easy access on the go.</li>
                <li><b>Voice and Gesture Recognition:</b> Add support for voice commands and gesture controls to enhance user interaction.</li>
            </ul>

            <h2>Our Vision</h2>
            <p>
                At Emosync, our vision is to revolutionize the way people interact with music by making it more intuitive, emotional, and personal. 
                We believe that music has the power to heal, uplift, and connect people, and our goal is to provide a platform that resonates with every user's emotional journey.
            </p>
            <p>
                <b>Discover the music that understands you. Sync your emotions with Emosync!</b>
            </p>
        </div>
    );
}

export default About;
