import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import ImageButton from '../components/ImageButton';
import ImageInput from '../components/ImageInput';
import Clock from '../images/clock.svg';
import '../css/gusser.css';

const Gusser = ({ socket }) => {
  const [guess, setGuess] = useState('');
  const [hintList, setHintList] = useState(['Waiting for Clues...']);

  const location = useLocation();

  useEffect(() => {
    socket.emit('gusserid', location.state.gusserid);
  }, []);

  useEffect(() => {
    console.log(guess);
  }, [guess]);

  //  On clickong Enter button
  const guessSubmitted = () => {
    socket.emit('guessSubmission', guess);
    console.log(guess);
    alert('Guess Submited...');
  };

  useEffect(() => {
    socket.on('game-ended', (gameValue) => {
      if (gameValue == 1) {
        window.location.href = '/';
      }
    });
  }, [socket]);

  // final array from host
  useEffect(() => {
    socket.on('gusserHints', (arr) => {
      console.log('<<< RECIVED >>>');
      setHintList(arr);
    });
  }, []);

  return (
    <div className='gusser'>
      <div className='gusser__bg'></div>
      <div className='gusser__teamranks d-flex justify-content-between px-3'>
        <h3 className='my-auto' style={{ color: '#ffffff' }}>
          Team Points
        </h3>
        <h3 className='my-auto' style={{ color: '#603913' }}>
          10
        </h3>
      </div>
      <div className='gusser__hints'>
        {hintList.map((hint, index) => {
          return <div key={index}>{hint}</div>;
        })}
      </div>
      <div className='gusser__timer d-flex align-items-baseline'>
        <img src={Clock} alt='time' />
        <h3>0:30</h3>
      </div>
      <div className='gusser__enterdiv'>
        <h3 className='fw-bold'>Guess the Word</h3>
        <br />
        <ImageInput
          text='Enter your Guess'
          change={(e) => setGuess(e.target.value)}
        />
        <ImageButton
          value='ENTER'
          clickMe={guessSubmitted}
          classlist='mt-3 gusser__enterbtn'
        />
      </div>
    </div>
  );
};

export default Gusser;
