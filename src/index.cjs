const blessed = require('blessed');
const moment = require('moment');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true,
  title: 'Text Animation',
  cursor: {
    artificial: true,
    shape: {
      bg: 'red',
      fg: 'white',
      bold: true,
      ch: '#'
    },
    blink: true
  }
});
let text = '';
let TYPE = 'clock';

if(process.argv.length === 2) {
    text = `{bold}${moment().format('h:mm:ss a')}{/bold}`;
} else if (process.argv.length === 3 && process.argv[2] === 'timer') {
    console.error('provide time to end as argument\ne.g. zeit timer 12:00:00 for a 12 hour timer');
    process.exit(1);
} else if(process.argv.length === 4 && process.argv[2] === 'timer') {
    text = `{bold}${moment(process.argv[3], "HH:mm:ss").format("HH:mm:ss")}{/bold}`;
    TYPE = 'timer';
} else {
    console.error('Usage: zeit -h | --help');
    process.exit(1);
}
// Create a text box to hold the text
const textBox = blessed.text({
  top: 'center',
  left: 'center',
  width: 'shrink',
  height: 'shrink',
  content: text,
  tags: true,
  bold: true,
  style: {
    fg: '#ffffff',
    weight: 'bold'
  }
});

// Append the text box to the screen
screen.append(textBox);

// Function to animate the letters
const animationInterval = 1000/60; // Approximately 16.67 ms for 60 fps
let frame = 0;

function animateLetters() {
  let animatedText = '';

  for (let i = 0; i < text.length; i++) {
    const offsetY = Math.round(Math.cos((frame + i) / 10) * 1);
    animatedText += text[i];
    textBox.top = screen.height / 2 + offsetY;
  }

  textBox.setContent(animatedText);
  
  // Redraw the screen
  screen.render();
  frame++;
}

function updateTimer() {
    if (TYPE === 'clock') {
      text = `{bold}${moment().format('h:mm:ss a')}{/bold}`;
    } else if (TYPE === 'timer') {
      text = moment(text, "HH:mm:ss");
      text.subtract(1, "seconds");
      text = `{bold}${text.format("HH:mm:ss")}{/bold}`;
      if (text === "00:00:00") {
        text = "{bold}Time's up!{/bold}";
        TYPE = 'time up';
      }
    }
  }
  

// Run the animation using setInterval
const animationLoop = setInterval(animateLetters, animationInterval);

const timeUpdateLoop = setInterval(updateTimer, 1000);

// Quit on 'q', or Control-C
screen.key(['q', 'C-c'], function (ch, key) {
    clearInterval(animationLoop);
    clearInterval(timeUpdateLoop);
    return process.exit(0);
});

// Render the initial screen
screen.render();
