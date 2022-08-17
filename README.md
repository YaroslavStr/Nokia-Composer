# Nokia 3310 Music Composer

## Overview

This project was created for the educational purpose after taking a course on Web applications development.
I decided to use the Nokia Composer add-on as the theme of the project to implement the Nokia Composer as a Web application.
This web add-on allows you to repeat the monophonic moonlighting of a melody like from an old Nokia 3310 and create a handwritten melody using the controls for entering the musical notation.

## Content

Project is based on [Nokia Composer](https://github.com/zserge/nokia-composer) and was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Technologies Used

Project is built with following packages versions:

`node@18.0.17`\
`react@18.2.0`\
`bootstrap@5.2.0`\
`react-bootstrap@2.5.0`\
`typescript@4.7.4`

## Installation

To start a project you need to install next packages versions:

`node@18.0.17`\
`npm@8.3.0`

Right after these packages will be installed run next script in terminal/console:

```
npm install
```

## Available Scripts

In the project directory, you can run:

```
npm start
```

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

## Usage

To use Nokia 3310 Music Composer user should follow next steps:

### Creating composition process

– Notes for the melody are entered in the `Selected Note` field. A list of basic notes is available for selection: `c d e f g a b`.\
– Standard note duration is `¼`, but you can change it by adding a number in front of the note symbol: `1, 2, 4, 8, 16, 32`. A `.` between the duration and the note increases the duration by half: `4.c = 2c`.\
– You can also add a pause with `–` as well as its duration: `2-`.\
– Use the `Make Sharp` button to place a major note `#` in front of the note.\
– Octaves 1-3 are placed after the note and can be chosen by provided buttons.\
– After editing a note, you can add the note to the composition with the `Add Note` button, while the `Clear Composition` button removes the created or chosen song from the phone screen.\
– The `Remove Last` button removes the last note added to the song in case you make a mistake when composing notes :)\
– `Play/Stop` button starts or completely stops playing the song.\
– Created compositions can be saved in the following format from `compositions.json` file in project tree.\
– The `Peek a song` drop-down list allows you to select one of the songs you've already created and added and play it 🙂
