import sys
import pyttsx3
import json

def make_file(command):
    try:
        engine = pyttsx3.init()
        text = command[2]
        filename = command[3]
        rate = command[4]
        voice = command[5]
        # fileWav = filepath + '/' + filename + '.wav'

        engine.setProperty('rate', int(rate))
        engine.setProperty('voice', voice)
        engine.save_to_file(text, filename)
        engine.runAndWait()
        print(json.dumps({"error": None,"name":filename,"type":"audio","rate":rate}))
        sys.exit()
    except Exception as e:
        print(json.dumps({"error":e}))
        sys.exit()

def get_info():
    try:
        engine = pyttsx3.init()
        voices = engine.getProperty('voices')
        rate = engine.getProperty('rate')
        print(json.dumps({"error":None,"voices":voices,"rate":rate}, default=lambda x: x.__dict__))
        sys.exit()
    except Exception as e:
        print(json.dumps({"error":None}))
        sys.exit()

if __name__=="__main__":
    command = sys.argv
    if command[1] == "make_file":
        make_file(command)
    elif command[1] == "get_info":
        get_info()
    else:
        print(json.dumps({"error":"unknown command"}))
        sys.exit()
