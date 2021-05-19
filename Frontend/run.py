from flask import Flask, render_template, request, jsonify
import os
import requests
from PIL import Image
from io import BytesIO
import numpy as np
import cv2
from pygame import mixer
from gtts import gTTS
import win32com.client
import pythoncom
import pytesseract
import time
from PIL import Image, ImageTk
import numpy as np
import matplotlib.pyplot as plt
import _thread
import speech_recognition as sr 
import moviepy.editor as mp
from PIL import Image

from PIL import GifImagePlugin
# Set the template and static folder to the client build
app = Flask(__name__, template_folder="build", static_folder="build/static")

app.config['SECRET_KEY'] = 'super secret key'
app.config['SITE'] = "http://0.0.0.0:5000/"
app.config['DEBUG'] = True


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    """ This is a catch all that is required for react-router """
    return render_template("index.html")


@app.route('/test', methods=['GET'])
def login():
    """ An example endpoint """
    if request.method == 'GET':
        return jsonify(status=200, text="Here is a test response")

@app.route('/imagecaption',methods=['GET','POST'])
def imagecaption():
    pythoncom.CoInitialize()
    if(request.args['submit_button']=='submit'):

        pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe'
        im = np.array(Image.open(requests.get(request.args['url'], stream=True).raw))
        cv2.imwrite('im.jpg', cv2.cvtColor(im, cv2.COLOR_RGB2BGR))
    # load the original image
        image = cv2.imread('im.jpg')   
        ret,thresh1 = cv2.threshold(image,120,255,cv2.THRESH_BINARY)
        # pytesseract image to string to get results
        text = str(pytesseract.image_to_string(thresh1, config='--psm 6'))
        print(text)
        if(len(text)!=0):
            # speaker = win32com.client.Dispatch("SAPI.SpVoice")
            # speaker.Speak(text)
            tts = gTTS(text)
            tts.save('hello.mp3')
            speaker = win32com.client.Dispatch("SAPI.SpVoice")
            speaker.Speak(text)

            return render_template('index.html',token=text)

        else:
            
            
            r = requests.post(
                            "https://api.deepai.org/api/densecap",
                            files={
                                'image': open('im.jpg', 'rb'),
                            },
                            headers={'api-key': '5a639662-a646-4656-8536-355046329996'}
                        )
            text = 'Image Caption starts Now. '
            for i in range(min(5,len(r.json()['output']['captions'])//2)):
                text += r.json()['output']['captions'][i]['caption']
                text +=". "
            tts = gTTS(text)
            tts.save('hello.mp3')
            speaker = win32com.client.Dispatch("SAPI.SpVoice")
            speaker.Speak(text)

            return render_template('index.html',token=text)

@app.route('/textcaption',methods=['GET','POST'])
def textcaption():
    pythoncom.CoInitialize()
    if(request.args['submit_button']=='submit'):
        text = request.args['url']        
        tts = gTTS(text)
        tts.save('hello.mp3')
        speaker = win32com.client.Dispatch("SAPI.SpVoice")
        speaker.Speak(text)

        return render_template('index.html',token='') 
            
        


@app.route('/videotrans',methods=['GET','POST'])
def videotrans():
    pythoncom.CoInitialize()
    print(request)
    if(request.args['submit_button'] == 'Do Something'):
        AUDIO_FILE = r"src\pages\Home\a.mp4"
# # Create a VideoCapture object and read from input file 
#         # cap = cv2.VideoCapture(AUDIO_FILE)
        
# # Create a VideoCapture object and read from input file 
        cap = cv2.VideoCapture(AUDIO_FILE)
#         clip = mp.VideoFileClip(AUDIO_FILE) 
#         clip.audio.write_audiofile(r"converted.wav")
#         print("AUDIO_FILE obtained")


        # # Video Transciption

        # In[21]:


        def print_time(result): 
            for i in range(len(result)):
                if(result[i] in arr):
                        ImageAddress = r'letters\\' + result[i]+'.jpg'
                        ImageItself = Image.open(ImageAddress)
                        ImageNumpyFormat = np.asarray(ImageItself)
                        ImageNumpyFormat = cv2.resize(ImageNumpyFormat,(224,224))
                        cv2.imshow('signs', ImageNumpyFormat)
                        cv2.waitKey(200)
                else:
                        cv2.waitKey(200)
                        continue
            cv2.destroyAllWindows()

        arr=['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r', 's','t','u','v','w','x','y','z']
        r = sr.Recognizer()
        audio = sr.AudioFile("converted.wav")
        
        # Check if camera opened successfully 
        if (cap.isOpened()== False):  
            print("Error opening video  file")

        i= time.perf_counter()
        x = 0
        
        # Read until video is completed 
        while(cap.isOpened()):
        # Capture frame-by-frame 
            ret, frame = cap.read() 
            if ret == True: 
            
                # Display the resulting frame
                frame = cv2.resize(frame,(512,512))
                cv2.imshow('Frame', frame)
                j = time.perf_counter()
                if(j-i > x):
                    with audio as source:
                        audio_file = r.record(source, duration=30, offset = x)
                    result = r.recognize_google(audio_file)
                    _thread.start_new_thread(print_time, (result,) )
                    print(result)
                    x+=30
            
                # Press Q on keyboard to  exit 
                if cv2.waitKey(25) & 0xFF == ord('q'): 
                    break
            
            # Break the loop 
            else:  
                break
            
            # When everything done, release  
            # the video capture object 
        cap.release() 
        
        # Closes all the frames 
        cv2.destroyAllWindows() 

    
    
        return render_template('index.html',token=result)
@app.route('/giftrans',methods=['GET','POST'])
def giftrans():
    pythoncom.CoInitialize()
    lis=[]
    if(request.args['submit_button'] == 'Start transcript'):
        for j in range(5):
            path = r"src\frames\frame" + str(j) + ".png"
            r = requests.post(
                    "https://api.deepai.org/api/densecap",
                    files={
                        'image': open(path,'rb'),
                    },
                    headers={'api-key': '5a639662-a646-4656-8536-355046329996'}
                )
            print(r.json()['output']['captions'][:2])
                
            for i in range(min(2,len(r.json()['output']['captions'])//2)):
                lis.append(r.json()['output']['captions'][i]['caption'])
        text='GIF captioning starts now. '
        textset = list(set(lis))
        for i in range(len(textset)):
            text += textset[i]
            text +=". "

        print(text)
        speaker = win32com.client.Dispatch("SAPI.SpVoice")
        speaker.Speak(text)
        
        return render_template('index.html',token=text)
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
