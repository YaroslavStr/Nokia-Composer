import React, {useEffect, useState} from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import { AudioContext } from 'standardized-audio-context';

import compositions from "./compositions.json";

window.AudioContext = window.AudioContext || window.webkitAudioContext;


const App = () => {
  const [bpm, setBpm] = useState(0);
  const [note, setNote] = useState('');
  const [currentNote, setCurrentNote] = useState('');
  const [duration, setDuration] = useState('');
  const [sharp, setSharp] = useState(false);
  const [octave, setOctave] = useState('');
  const [composition, setComposition] = useState('');
  const [isGoing, setPlay] = useState(false);
  const [C, setC] = useState();

  const durations: any = ['1', '2', '4', '6', '8', '16', '32', '.']
  const noteItems: any = ['c', 'd', 'e', 'f', 'g', 'a', 'b', '-'];
  const octaves: any = ['1', '2', '3'];


  let stop = () => {
    // @ts-ignore
    C && C.close();
    // @ts-ignore
    setC(0);
  } // interrupt the playback, if any

  //return bpm value with correlation between a and b
  let c = (x = 0, a: any, b: any) => (x < a && (x = a), x > b ? b : x); // clamping function (a<=x<=b)

  let z: any,
    g: any,
    t: any,
    v: any,
    k: any,
    n: number,
    d: number;

  // Write encoded song tp URI
  useEffect(() => {
    window.location.hash = btoa(
      JSON.stringify({bpm, composition}),
    );
  }, [bpm, composition]);

  // Compose end note based on currentNote, duration, octave and sharpness...
  useEffect(() => {
    setNote(duration.concat(sharp ? '#' : '', currentNote, octave));
  }, [duration, currentNote, sharp, octave]);

  // Play composition
  const play = (s: any, bpm: string) => {
    // Create audio context, square oscillator and gain to mute/unmute it
    // @ts-ignore
    const newC = new AudioContext();
    // @ts-ignore
    setC(newC);
    // @ts-ignore
    (z = newC.createOscillator()).connect((g = newC.createGain())).connect(newC.destination);
    z.type = 'square';
    z.start();
    t = 0; // current time counter, in seconds
    v = (x: any, v: any) => x.setValueAtTime(v, t); // setValueAtTime shorter alias
    for (let m of s.matchAll(/(\d*)?(\.?)(#?)([a-g-])(\d*)/g)) {
      k = m[4].charCodeAt(); // note ASCII [0x41..0x47] or [0x61..0x67]
      // @ts-ignore
      n = 0 | ((((k & 7) * 1.6 + 8) % 12) + !!m[3] + 12 * c(m[5], 1, 3)); // note index [0..35]
      v(z.frequency, 261.63 * 2 ** (n / 12));
      v(g.gain, (~k & 8) / 8);
      // note duration, measured in 1/10 seconds to simplify further ratios,
      // i.e. multiply by 7 instead of 0.7
      // @ts-ignore
      d = (24 / bpm / c(m[1] || 4, 1, 64)) * (1 + !!m[2] / 2);
      t = t + d*7;
      v(g.gain, 0);
      t = t + d*3;
    }
  };

  // Toggle composition playback
  const togglePlayback = () => {
    if (C) {
      setPlay(false);
      stop();
    } else {
      setPlay(true);
      play(composition, c(bpm, 40, 400));
    }
  }

  // Compose composition based on different duration types
  const composeDuration = (type: string) => {
    if (!note) return;

    if (type === '.' && duration.includes('.')) {
      setDuration(duration.replace('.', ''));
      return;
    }

    if (type === '.') {
      setDuration(currentNote === '-' ? duration : duration.concat(type));
    } else {
      setDuration(type);
    }
  }

  // Compose current note
  const composeNote = (type: string) => {
    if (type === '-') {
      setSharp(false);
      setDuration(duration.replace('.', ''));
    }

    setCurrentNote(type);
  }

  // Compose octave
  const composeOctave = (type: string) => {
    if (!note || currentNote === '-') return;
    setOctave(type);
  }

  // Clear note and parameters
  const clearNote = () => {
    setNote('');
    setDuration('');
    setCurrentNote('');
    setSharp(false);
    setOctave('');
  }

  // Make not sharp
  const makeSharp = () => {
    setSharp(!sharp);
  }

  // Add a composed note to composition
  const addNote = () => {
    setComposition(composition.concat(' ', note));
  }

  // Clear composition
  const clearComposition = () => {
    setComposition('');
    setPlay(false);
  }

  const playSong = (item: any) => {
    setComposition(item.song);
    setBpm(item.bpm);
  }

  const removeLastNote = () => {
    const oldComposition = composition.split(' ');
    oldComposition.pop();
    setComposition(oldComposition.join(' '));
  }

  return (
    <div className="d-flex flex-row align-items-start justify-content-between">
      <div className="app-container">
        <div className="content-container">
          <div className="note-wrapper d-flex align-items-center justify-content-between p-3 border border-2 border-danger my-3">
            <div>
              <label htmlFor="note" className="me-2">Selected Note:</label>
              <input id="note"
                     type="text"
                     value={note}
                     readOnly={true}
                     onChange={() => {
                     }}
                     size={3}/>
            </div>
            {note && <Button variant="outline-danger" className="px-2 py-0 my-0" onClick={() => clearNote()}>x</Button>}
          </div>
          <div className="bpm-wrapper ps-3">
            <label htmlFor="bpm" className="me-2">Tempo:</label>
            <input id="bpm"
                   value={bpm}
                   onChange={(e: any) => setBpm(e.target.value)}
                   size={3}/>
          </div>
          <div className="my-4 ps-3">
            <label htmlFor="noteBtn">Notes: </label>
            {noteItems.map((item: string, index: number) => {
              return <button id="noteBtn" className="mx-2 border-1" name={item} key={index}
                             onClick={() => composeNote(item)}>{item}</button>
            })}
          </div>
          <div className="ps-3">
            <label htmlFor="duration" className="me-2">Durations:</label>
            {durations.map((item: string, index: number) => {
              return <button id="duration" disabled={!note} className="mx-2 border-1" name={item} key={index}
                             onClick={() => composeDuration(item)}>{item}</button>
            })}
          </div>
          <div className="ps-3 my-3">
            <label htmlFor="sharp" className="me-2">Sharp:</label>
            <Button variant="outline-danger"
                    id="sharp"
                    className="px-2 py-1 mx-2 border-1 fs-6"
                    disabled={!note || currentNote === '-'}
                    onClick={() => makeSharp()}>Make Sharp</Button>
          </div>
          <div className="ps-3">
            <label htmlFor="octaves" className="me-2">Octaves:</label>
            {octaves.map((item: string, index: number) => {
              return <button id="octaves" className="mx-2 border-1" disabled={!note} name={item} key={index}
                             onClick={() => composeOctave(item)}>{item}</button>
            })}
          </div>
          <div className="ps-3 mt-3 d-flex flex-wrap justify-content-between">
            <div className="w-50 pe-2">
              <Button variant="success"
                      id="addNote"
                      className="w-100 py-3"
                      disabled={!note}
                      onClick={() => addNote()}>Add Note</Button>
            </div>
            <div className="w-50 ps-2">
              <Button variant="danger"
                      id="clearComposition"
                      className="w-100 py-3"
                      disabled={!composition}
                      onClick={() => clearComposition()}>Clear Composition</Button>
            </div>
            <div className="w-50 pe-2 mt-4">
              <Button variant="outline-dark" className="w-100 py-3" id="playBtn" disabled={!composition} onClick={() => togglePlayback()}>
                {isGoing ? 'Stop' : 'Play'}
              </Button>
            </div>
            <div className="w-50 ps-2 mt-4">
              <Button variant="warning" className="w-100 py-3 text-white" id="removeLastBtn" disabled={!composition} onClick={() => removeLastNote()}>
                Remove Last
              </Button>
            </div>
          </div>
        </div>
        <div className="compositions-container ps-3">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Pick a song  :)
            </Dropdown.Toggle>
            <Dropdown.Menu className="songList">
              {compositions.compositions.map((song: any, index: number) => {
                return <Dropdown.Item key={index} onClick={() => playSong(song)}>{song.title}</Dropdown.Item>
              })}
            </Dropdown.Menu>
          </Dropdown>


        </div>
      </div>
      <div className="phone position-relative">
         <textarea value={composition}
                   onChange={() => {
                   }}
                   readOnly={true}
                   className="position-absolute composition-container fs-5"
                   id="song"
                   spellCheck="false">{composition}</textarea>
      </div>
    </div>
  );
}

export default App;
