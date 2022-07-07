import librosa
import numpy as np
import tensorflow as tf
import yt_dlp
import sys 
import os

modelName = 'GTZANPretrainedCNN.h5'
genres = ["blues", "classical", "country", "disco", "hiphop", "jazz", "metal", "pop", "reggae", "rock"]
genres.sort()


#function that removes downloaded file after prediction is over
def clean(url):
    video_id = ""
    if "=" in url:
        video_id = url.split("=")[1]
    if "youtu.be/" in url:
        video_id = url.split("youtu.be/")[1]
    filename = str("tmp/" + video_id + ".m4a")
    os.remove(filename)


def downloadSong(url):
    # video_id = url.split("=")[1] #parse URL and keep video ID, will be used as filename
    video_id = ""
    if "=" in url:
        video_id = url.split("=")[1]
    if "youtu.be/" in url:
        video_id = url.split("youtu.be/")[1]
    try:
        video_info = yt_dlp.YoutubeDL().extract_info(
            url = url,download=False
        )
    except:
        output = {"message": "failed to download URL. Is it a valid youtube link?"}
        print(output)
        sys.exit(0)

    #ignore videos that are longer than 10min
    try:
            
        #ignore videos that are longer than 10min
        if(int(video_info["duration"]) > 900 ):
            output = {"message": "song is too long"}
            print(output)
            sys.exit(0)
        
        if(int(video_info["duration"]) < 2 ):
            output = {"message": "song is too short"}
            print(output)
            sys.exit(0)
    except KeyError:
        output = {"message": 'Song has no duration argument, this can happen when the link matches a livestream'}
        print(output)
        sys.exit(0)

    filename = str("tmp/" + video_id + ".m4a")
    options={
        'format':'m4a',
        'keepvideo':False,
        'outtmpl':filename,
    }
    with yt_dlp.YoutubeDL(options) as ydl:
        ydl.download([video_info['webpage_url']])

#preocess the song to predict
def processSong(songData):
    songLength = songData.shape[0]
    chunkSize = 33000 #=1.5sec
    spectrograms = []
    for i in range(0, songLength, chunkSize):
            signal = np.array(songData[i:i+chunkSize])#load a chunk
            if(len(signal) != chunkSize): #check the size of the chunk
                continue
            #add the spectrogram of the chunk to the array
            spectrograms.append(librosa.feature.melspectrogram(y=signal, n_fft=1024, hop_length=256, n_mels=128)[:,:,np.newaxis])
            #add the genre matching the spectrogram to the array
    spectrograms = np.array(spectrograms)
    return spectrograms


#node childprocess didnt have enough RAM to process a song in one go
#instead, split the song in chunks of 2min and process one after another
def predictInChunk(url):
    video_id = ""
    if "watch?v=" in url:
        video_id = url.split("watch?v=")[1]
    if "youtu.be/" in url:
        video_id = url.split("youtu.be/")[1]
    
    filename = str("tmp/" + video_id + ".m4a")
    signal, sr = librosa.load(filename)
    chunksize_minutes=2 #split file in 2min parts
    step = int(((chunksize_minutes*60)/1.5)*33000) #calculate size of a 2min chunk
    subdivs = signal.shape[0]//step #how many whole 2min chinks
    rest = signal.shape[0]%step #what remains after division
    
    CNN = tf.keras.models.load_model('python/models/GTZANPretrainedCNN.h5') #load the model
    totalUnique = np.array([], dtype=int) #array that will store the genres detected
    totalCounts = np.array([], dtype=int) #array that will store the count of each genre
    totalPrediction = []
    for i in range(0, subdivs, 1):
        start = i*step
        end = start + step
        melspec = processSong(signal[start:end])
        prediction = np.argmax(CNN.predict(melspec), axis=-1) #predict the classes
        totalPrediction.extend(prediction)
        #add the predicted class to the total
        newUnique, newCounts = np.unique(prediction, return_counts=True)
        totalUnique, idx = np.unique(np.hstack((totalUnique, newUnique)), return_inverse=True)
        totalCounts = np.bincount(idx, np.hstack((totalCounts, newCounts)))
        del melspec
        del newUnique
        del newCounts

    #only execute this if there is enough data for a chunk
    if(rest > 33000):
        melspec = processSong(signal[subdivs*step:subdivs*step+rest])
        prediction = np.argmax(CNN.predict(melspec), axis=-1) #predict the classes
        totalPrediction.extend(prediction)
        del melspec
        newUnique, newCounts = np.unique(prediction, return_counts=True)
        totalUnique, idx = np.unique(np.hstack((totalUnique, newUnique)), return_inverse=True)
        totalCounts = np.bincount(idx, np.hstack((totalCounts, newCounts)))
        totalCounts = totalCounts.astype(int)

    
    higherGuess = np.argmax(totalCounts)
    bestGuess = genres[totalUnique[higherGuess]] #genre with most predictions
    array = []
    for i in range(len(totalUnique)):
        array.append({"name": genres[totalUnique[i]], "count": totalCounts[i]})

    array = sorted(array, key=lambda d: d['count'], reverse=True) 

    #count total chunks
    total = 0
    for c in totalCounts:
        total = total + c


    output = {
        "guess": array,
        "higherGuess": bestGuess,
        "higherCount": totalCounts[higherGuess],
        "total": total,
        "message": "success",
        "rawData": totalPrediction
    }
    print(output)
    
def main():
    param = sys.argv[1]
    ytURL = param.split("&")[0]
    try:
        downloadSong(ytURL)
        predictInChunk(ytURL)  
        clean(ytURL)
    except:
        output = {"message": "Unexpected error"}
        print(output)


if __name__ == '__main__':
    main()
