

## About
Sense Dupe is the memory puzzle game, a community contributed various levels. challenge the levels

## Contributing
Adding a game level to the library is very simple. All the level are from a `sensedupe.json` file and game images in the root of project.

To add your level, fork this repository, add your level name, path of the game-images folder along with your github username to the end of the json file, add all game-images according to the path set in json file and submit a pull request. Don't forget the commas and follow the game-images size as (40px/40px)!

```
[
    {
        …
    },
    {
      "name": "Angry Bird",
      "path": "angry-bird",
      "creator": "dannibla"
    }
]
```

&nbsp;

### Improvements and Bugs
Please feel free to open a new issue [here](https://github.com/dannibla/SenseDupe/issues) with your suggestions or any bugs which you may have come across.

&nbsp;

## Data
While there is no official api, all the game levels are present in the `sensedupe.json` file. The code below is an example of fetching the data via a CURL request
```
curl -i https://raw.githubusercontent.com/dannibla/SenseDupe/master/sensedupe.json
```
