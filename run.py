from flask import Flask, render_template, request, jsonify
import os
import requests

# Set the template and static folder to the client build
app = Flask(__name__, template_folder="socialmedia-client/build", static_folder="socialmedia-client/build/static")

app.config['SECRET_KEY'] = 'super secret key'
app.config['SITE'] = "http://0.0.0.0:5000/"
app.config['DEBUG'] = True


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    """ This is a catch all that is required for react-router """
    return render_template('index.html')


@app.route('/test', methods=['GET'])
def login():
    """ An example endpoint """
    if request.method == 'GET':
        return jsonify(status=200, text="Here is a test response")

@app.route('/imagecaption',methods=['GET','POST'])
def imagecaption():
     if request.form['submit_button'] == 'START':
                r = requests.post(
                    "https://api.deepai.org/api/densecap",
                    files={
                        'image': open(r'C:\\Users\\nishc_omjn2ty\\Downloads\\Nmit\\static\\images\\train.jpg', 'rb'),
                    },
                    headers={'api-key': '5a639662-a646-4656-8536-355046329996'}
                )
                print(r.json()['output']['captions'][0]['caption'])
                text = r.json()['output']['captions'][0]['caption']
   #             tts = gTTS((r.json()['output']['captions'][0]['caption']))
  #              tts.save('hello.mp3')
 #               speaker = win32com.client.Dispatch("SAPI.SpVoice")
#                speaker.Speak(text)
                return render_template('index.html',message=text, l=0,message_post='', display=0)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
