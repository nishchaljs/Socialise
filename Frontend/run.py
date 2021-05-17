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
        im = np.array(Image.open(requests.get(request.args['url'], stream=True).raw))
        cv2.imwrite('im.jpg', cv2.cvtColor(im, cv2.COLOR_RGB2BGR))
         
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


@app.route('/videotrans',methods=['GET','POST'])
def videotrans():
    var = []
    if request.form['submit_button'] == 'START TRANSCRIPT':
        def print_time(result): 
            print(result)
            for i in range(len(result)):
                if(result[i] in arr):
                        ImageAddress = r"C:\Users\nishc_omjn2ty\OneDrive\Desktop\nmit2021\Video_Transcription\letters\\" + result[i]+'.jpg'
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
                try:
                  result = r.recognize_google(audio_file)

                except:
                  break

                _thread.start_new_thread(print_time, (result,) )
                print(result)
                var.append(result)
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
#                cv2.destroyAllWindows() 
#                var=['recoupment 2004 with unknown fever sign I don\'t know who this guy is what was effective he had',
#                     'ab started As a young rising figure in the horrible Sky was this assistance is uses of people ',
#                     'how to use Kansas serve white people with side dishes like us']
#
#                result = 'I am defined!'
    
        return render_template('insta_tabs.html',transcript=result, l = len(var), var=var, display=1)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
