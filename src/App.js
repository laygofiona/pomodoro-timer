import './App.css';
import React, { useEffect, useState} from 'react';
import soundfile from '../src/alarm-beep.mp3';


const BreakSessionSection = (props) => {
  const [disabled, setDisabled] = useState(false);

  const sessionIncrement = () => {
    if(parseInt(props.sessionVal['minutes']) < 60 && props.sessionMinVal < 60){
      props.setSessionMinFunc(min => min = min + 1);
    }
  }

  const sessionDecrement = () => {
    if(parseInt(props.sessionVal['minutes']) >= 2 && props.sessionMinVal >= 2){
      props.setSessionMinFunc(min => min = min - 1);
    }
  }

  const breakIncrement = () => {
    if(parseInt(props.sessionVal['minutes']) < 60 && props.breakMinVal < 60){
      props.setBreakMinFunc(min => min = min + 1);
    }
  }

  const breakDecrement = () => {
    if(parseInt(props.sessionVal['minutes']) >= 2 && props.breakMinVal >= 2){
      props.setBreakMinFunc(min => min = min - 1);
    }
  }

  useEffect(() => {
    if(props.breakMinVal < 0) {
      props.setBreakMinFunc(min => min * -1);
    }
    if(props.sessionMinVal < 0) {
      props.setSessionMinFunc(min => min * -1);
    }

    if(props.breakIsOnVar) {
      props.setTimeFunc((timeObj) => {
        return {
          'minutes': props.breakMinVal,
          'seconds': 0
        }
      });
    } else {
      props.setTimeFunc((timeObj) => {
        return {
          'minutes': props.sessionMinVal,
          'seconds': 0
        }
      });
    }
  }, [props.breakMinVal, props.sessionMinVal])
  

  useEffect(() => {
    if(props.isOnVar) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [props.isOnVar])

  return (
    <div className='BreakSession container m-3 p-2'>
      <div className='sectionColumn'>
        <h4 id="break-label" className="text-xl">Break Length</h4>
        <span className='sectionRow text-center text-2xl'><button disabled={disabled} type="button" className="btn-c" id="break-decrement" onClick={breakDecrement}><h4><i class="bi bi-caret-down-fill"></i></h4></button><h4 id="break-length">{props.breakMinVal}</h4><button type="button" disabled={disabled} className='btn-c' id="break-increment" onClick={breakIncrement}><h4><i class="bi bi-caret-up-fill"></i></h4></button></span>
      </div>
      <div className='sectionColumn'>
        <h4 id="session-label" className='text-xl'>Session Length</h4>
        <span className='sectionRow text-center text-2xl'><button type="button" className='btn-c' id="session-decrement" disabled={disabled} onClick={sessionDecrement}><h4><i class="bi bi-caret-down-fill"></i></h4></button><h4 id="session-length">{props.sessionMinVal}</h4><button disabled={disabled} type="button" className='btn-c' id="session-increment" onClick={sessionIncrement}><h4><i class="bi bi-caret-up-fill"></i></h4></button></span>
      </div>
    </div>
  )
}

const Timer = (props) => {
  return (
    <div className='text-center p-2 timerBackground'>
      <h3 id="timer-label" className="text-2xl">{props.breakIsOnVar ? 'Break' : 'Session'}</h3>
      <h1 id="time-left" className="text-5xl sm:text-7xl">{`${props.minutes}:${props.seconds}`}</h1>
    </div>
  )
}


 
const App = () => {
  const [isOn, setIsOn] = useState(false);
  const [color, setColor] = useState({
    "outer": "#ba4949",
    "inner": "#c25d5c"
  });
  const [breakIsOn, setBreakIsOn] = useState(false);
  const [interval, setIntervalTime] = useState("");
  const [sessionMin, setSessionMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [time, setTime] = useState({
    "minutes": sessionMin,
    "seconds": 0
  });
  const [timeStrings, setTimeStrings] = useState({
    "minutes": toString(sessionMin),
    "seconds": 0
  });

  const checkSeconds = (seconds, minutes) => {
    let newSeconds = seconds;
    let newMinutes = minutes;

    if(newSeconds == 0 && newMinutes >= 1){
      newSeconds = 59;
      newMinutes--;
    } else if(newSeconds <= 59 && newSeconds !== 0) {
      newSeconds--;
    } 

    return {
      "minutes": newMinutes,
      "seconds": newSeconds
    }
  }

  const padWithLeadingZeros = (num, totalLength)  => {
    return String(num).padStart(totalLength, '0');
  }

  const addZeroes = (seconds, minutes) => {
    let secondsString = seconds;
    let minutsesString = minutes;
    
    if(minutes < 10) {
      minutsesString = padWithLeadingZeros(minutes, 2);
    }
    
    if(seconds < 10) {
      secondsString = padWithLeadingZeros(seconds, 2);
    } 

    return {
      "minutes": minutsesString,
      "seconds": secondsString
    }

  }

  const runTime = (breakOn) => {
    if(breakOn) {
      setTime(timeObj => timeObj = checkSeconds(1, breakMin))
    } else {
      setTime(timeObj => timeObj = checkSeconds(1, sessionMin))
    }

    setIsOn(true);
    setIntervalTime(setInterval(() => {
      setTime(timeObj => checkSeconds(parseInt(timeObj['seconds']), parseInt(timeObj['minutes'])));
     }, 1000));
  }
  

  useEffect(() => {
    setTimeStrings(addZeroes(time["seconds"], time["minutes"]));
    if(isOn == true) {
      // Code used to be here
      //check minutes
      if(parseInt(time["seconds"]) == 0 && parseInt(time["minutes"]) == 0) {
        for(let i = 0; i < 20; i++) {
          document.getElementById('beep').play();
        }
        clearInterval(interval);
        setTimeout(() => {
          if(!breakIsOn) {
            setBreakIsOn(true);
            setColor({
              "outer": "#38868a",
              "inner": "#4e9396"
            });
            //run breaktime automatically
            runTime(true);
          } else {
            setBreakIsOn(false);
            setColor({
              "outer": "#ba4949",
              "inner": "#c25d5c"
            });
            //run session automatically
            runTime(false);
          }
        }, "5000");
      }
    } 
  }, [time])

  useEffect(() => {
    document.body.style.backgroundColor = color.outer;
    document.querySelector('.App').style.backgroundColor = color.inner;
  }, [color])

  const handleClick = () => {
    if (isOn == false) {
      setIsOn(true);
      setIntervalTime(setInterval(() => {
        setTime(timeObj => checkSeconds(parseInt(timeObj['seconds']), parseInt(timeObj['minutes'])));
       }, 1000));
    } else {
      clearInterval(interval);
      setIsOn(false);
    }
  }

  const reset = () => {
    
    if(interval !== undefined || interval !== null) {
      clearInterval(interval);
      setIsOn(false);
    }
    document.getElementById('beep').pause();
    document.getElementById('beep').currentTime = 0;
    setBreakIsOn(false);
    setColor({
      "outer": "#ba4949",
      "inner": "#c25d5c"
    })
    setBreakMin(5);
    setSessionMin(25);
    setTime({
      "minutes": sessionMin,
      "seconds": 0
    });
    setTimeStrings({
      "minutes": sessionMin,
      "seconds": 0
    });
  }


  return (
    <div className="outer">
    <div className="timer-container-size timer-container" >
      <div className="m-3">
        <h2 className='text-center text-4xl sm:text-7xl'>Pomodoro Timer</h2>
      </div>
      <div className='App d-flex justify-content-center align-items-center rounded'>
        <div>
          <BreakSessionSection breakIsOnVar={breakIsOn} sessionVal={timeStrings} setSessionMinFunc={setSessionMin} setBreakMinFunc={setBreakMin} breakMinVal={breakMin} sessionMinVal={sessionMin} setTimeFunc={setTime} isOnVar={isOn}/>
          <audio id="beep" src={soundfile}></audio>
          <Timer breakIsOnVar={breakIsOn} minutes={timeStrings['minutes']} seconds={timeStrings['seconds']}/>
        </div>
      </div>
      <div className='buttons m-1 p-2'>
            <span>
              <button type="button" className="btn-c" id="start_stop" onClick={handleClick}>
                {
                  isOn ? <i class="bi bi-pause-fill"></i> : <i class="bi bi-play-fill"></i>
                }
              </button>
            </span>
            <span>
              <button type="button" className="btn-c" id="reset" onClick={reset}> 
                <i class="bi bi-arrow-counterclockwise"></i>
              </button>
            </span>
        </div>
    </div>
    </div>
  );
}

export default App;
