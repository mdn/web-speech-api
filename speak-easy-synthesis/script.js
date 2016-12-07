(function() {
  'use strict';

  if (!('speechSynthesis' in window)) {
    console.info('Sorry! This Browser version does not supports HTML5 Speech synthesis API.');
    return;
  }

  console.info('Awesome! This Browser version does supports HTML5 Speech synthesis API. Make your web apps talk!');

  var synth = window.speechSynthesis;

  var inputForm = document.querySelector('form');
  var inputTxt = document.querySelector('.txt');
  var voiceSelect = document.querySelector('select');

  var pitch = document.querySelector('#pitch');
  var pitchValue = document.querySelector('.pitch-value');
  var rate = document.querySelector('#rate');
  var rateValue = document.querySelector('.rate-value');
  var volume = document.querySelector('#volume');
  var volumeValue = document.querySelector('.volume-value');

  var voices = [];

  function populateVoiceList() {
    voices = synth.getVoices();
    var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
    voiceSelect.innerHTML = '';
    for(var i = 0; i < voices.length ; i++) {
      var option = document.createElement('option');
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

      if(voices[i].default) {
        option.textContent += ' -- DEFAULT';
      }

      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);
      voiceSelect.appendChild(option);
    }
    voiceSelect.selectedIndex = selectedIndex;
  }

  populateVoiceList();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }

  inputForm.onsubmit = function(event) {
    event.preventDefault();

    var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for(var i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
      }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    utterThis.volume = volume.value;
    synth.speak(utterThis);

    utterThis.onpause = function(event) {
      var char = event.utterance.text.charAt(event.charIndex);
      console.log('Speech paused at character ' + event.charIndex + ' of "' +
      event.utterance.text + '", which is "' + char + '".');
    }

    inputTxt.blur();
  }

  pitch.onchange = function() {
    pitchValue.textContent = pitch.value;
  }

  rate.onchange = function() {
    rateValue.textContent = rate.value;
  }

  volume.onchange = function() {
    volumeValue.textContent = volume.value;
  }

})();