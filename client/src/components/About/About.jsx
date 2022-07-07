import { ConfusionMatrix } from "./ConfusionMatrix";

export function About(){
    return(
        <div className="about-text">
            <div>
                <h1>About ONOBOT</h1>

                <section>
                    <h3>Why was ONOBOT created ?</h3>
                    <p>
                        ONOBOT was created as part of a school project conducted in Master of Engineering in Information and Network Securty (INS) in the University of Limerick, Ireland
                    </p>
                    <p>
                        This project was realized throughout the entire year, from september 2019 to september 2020, it recieved a QCA score of <strong>3.87/4</strong>
                    </p>
                </section>
            
                <section>
                    <h3>The approach</h3>
                    <p>
                        In order to classify a music, ONOBOT converts audio files into <strong>mel-spectrograms</strong> (a visual representation of audio) and applies image recognition
                        on it using a <strong>Convolutional Neural Network</strong> (CNN), which is a model structure specialized in image recognition. A melspectrogram (example below) contains 
                        information on the <strong>frequency</strong> (Y-axis), <strong>time</strong> (X-axis) and <strong>amplitude</strong> (Color scale). This allows us to have a lot of informations with only one image.
                    </p>
                    <img 
                        className="melspectrogram-figure"
                        src={`${process.env.PUBLIC_URL}/images/report/melspectrogram.png`} 
                        alt="melspectrogram"
                        title="a melspectrogram"
                    />
                    <p>
                        To be more accurate, ONOBOT splits the audio files into <strong>chunks of 1.5 seconds</strong>, convert them into melspectrograms and predict the genre of each chunk separately.
                        This allows us to see the evolution of the genre through the music, and gives more precision on the final result.
                    </p>
                    <p>
                        The technologies used by ONOBOT are
                    </p>
                        <ul>
                            <li><strong>Python</strong></li>
                            <li><strong>Tensorflow</strong> with <strong>Keras</strong>, to create the deep-learning neural network</li>
                            <li><strong>Librosa</strong> for audio processing</li>
                            <li><strong>GTZAN</strong> dataset</li>
                        </ul>
                    
                        
                </section>

                <section>
                    <h3>GTZAN Dataset</h3>
                    <p>The most important part of most AI projects is the dataset. In the case of ONOBOT, the dataset is the <a href="https://www.kaggle.com/datasets/andradaolteanu/gtzan-dataset-music-genre-classification">GTZAN dataset</a>
                    , which is the most used for the task of music genre recognition. It is composed of a <strong>thousand 30 seconds tracks</strong>, distributed evenly between 10 music genres:
                    </p>
                    <ul id="report-genre-list">
                        <li>Blues</li>
                        <li>Classical</li>
                        <li>Country</li>
                        <li>Disco</li>
                        <li>Hip-hop</li>
                        <li>Jazz</li>
                        <li>Metal</li>
                        <li>Pop</li>
                        <li>Reggae</li>
                        <li>Metal</li>
                    </ul>
                    <p>
                    70% of the dataset was kept for training data and 30% for validation data. After pre-processing, that makes a total of 14000 melspectrograms for training and 6000 for validation.
                    
                    </p>
                    
                </section>
                

                <section>
                    <h3>Results</h3>
                        <p>
                        The accuracy of ONOBOT was estimated on the validation data. There are two ways we can evaluate it.
                        <br/>
                        On an individual 1.5sec segment, the accuracy is <strong>74%</strong>
                        <br/>
                        If we put the song back together and look at the most predicted genre, the accuracy reaches <strong>86%</strong>
                        </p>
                        <h4 style={{textAlign: 'center'}}>Confusion matrix (1.5sec segments)</h4>
                        <div id="confusion-matrix"> 
                            <ConfusionMatrix/>
                        </div>
                </section>

                <section>
                    <h3>Why the name "ONOBOT" ?</h3>
                    <p>Good question.</p>
                </section>

            </div>
        </div>
    )
}