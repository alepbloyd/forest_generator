# Intro

https://alepbloyd.github.io/forest_generator/

![springwinter 2](https://user-images.githubusercontent.com/17027357/177023434-b1b0f1d7-c64d-417c-888e-b9a1a12c1870.png)

This randomly generates a forest when page loads and brightens in a radius around wherever the user clicks. It contains a number of random functions that build off of each other to:

1. Choose a season and set colors accordingly.
1. Place a pond of a random size and shape.
1. Place trees randomly across the cells, and choose from a selection of pre-defined shapes to render them.
1. Create a nice little trail that weaves between trees.
1. Generate sparkles (asterisks) in a few different patterns at random intervals on unoccupied cells.
1. Place little rudimentary rock shapes on a handful of random cells.

Chrome does not run this too smoothly above a certain window size, but generally works alright if you shrink your viewing window down and refreshing, or generally runs smoother in Firefox. In addition - this is a work-in-progress-first-ever project, so code contains comments and is disorganized. 

## Why the long README?

Because trying to explain a thought process is hard and I had fun making this project, so I figure this is good practice!

This is my first project, before learning any sort of organization or best practices, and mostly just an exercise in "Here's an idea. How far can I get in figuring out that idea with what I know + google?". So, expect some squiggly, messy, unoptimized, code in here - I'm hoping to use this as a big refactoring and improving project once I learn some more concepts I could apply here.

Below here is a rambly attempt to retrace my thought process in chronological order, from each feature to each feature, and what I remember about how I approached making each feature of this project.

(This (as in the readme itself, not just the code) is a work-in-progress, and will be updated if I have time between classes and projects at [Turing](https://www.turing.edu)!)

# Background

Hooooo boy I feel like I learned a lot while stumbling through this, and at least 75% of what I learned is what *not* to do in future projects.
- Maybe sticking all of my script into one file is not the right way to handle things?
- What the heck is a branch, or a commit, or git? Doesn't everyone code and hope that it works, break everything, try to fix it, get frustrated, and then hold down ```cmd+z``` for a few minutes to try to get back to a functional point and try to remember what aspects of what they did worked?
- What is 'planning ahead?'

The impetus for this project came from working through the *Foundations* course on [The Odin Project](https://www.theodinproject.com). Somewhere around the end of that course, there is a challenge to create a grid based on user input for number of rows and columns, with the goal of learning a bit of dom manipulation. After I figured out a way to do this (Flex-box-ing! Loops! Creating elements!), I was super excited thinking about the potential from that basic task as a starting point.

If I could generate a grid, and the grid makes each cell in it one-by-one (kind of?), then I could assign a unique identity to each cell as it's created, which then meant that I could do different things to each one depending on criteria that I could set.

I imagine for folks who have been programming for a while, that might seem almost self-evident - of course you can do a thing to a thing, duh - but that first glimpse of creative potential when learning a new skill feels wild and exciting. I'm new at this, but coding makes me feel creative in a way that feels slow and deliberate and satisfying.

## Brightness and Distance!

This was the first part that felt like it was going to be a big challenge for me going into it, and hey it definitely was.

What I pictured at first was not 'animated' in any way, just click and an area would appear around the cell you clicked on. I imagined that this would be good practice for needing to put in an event listener, but also to get more practice with dom manipulation, changing the appearance of things with getElementById and getElementsByClassName in response to a user input.

I started out this portion by drawing out a grid on some dotted paper, marking a spot as the origin (might have said 'click' when marking it), and then drew out the distance from the origin cell.


|   	|   	|   	|   	|   	|   	|   	|   	|   	|   	|
|---	|---	|---	|---	|---	|---	|---	|---	|---	|---	|
| 5 	| 5 	| 5 	| 5 	| 5 	| 5 	| 5 	| 5 	| 5 	| 5 	|
| 4 	| 4 	| 4 	| 4 	| 4 	| 4 	| 4 	| 4 	| 4 	| 5 	|
| 4 	| 3 	| 3 	| 3 	| 3 	| 3 	| 3 	| 3 	| 4 	| 5 	|
| 4 	| 3 	| 2 	| 2 	| 2 	| 2 	| 2 	| 3 	| 4 	| 5 	|
| 4 	| 3 	| 2 	| 1 	| 1 	| 1 	| 2 	| 3 	| 4 	| 5 	|
| 4 	| 3 	| 2 	| 1 	| X 	| 1 	| 2 	| 3 	| 4 	| 5 	|
| 4 	| 3 	| 2 	| 1 	| 1 	| 1 	| 2 	| 3 	| 4 	| 5 	|
| 4 	| 3 	| 2 	| 2 	| 2 	| 2 	| 2 	| 3 	| 4 	| 5 	|
| 4 	| 3 	| 3 	| 3 	| 3 	| 3 	| 3 	| 3 	| 4 	| 5 	|

This was a decent start, but it resulted in a perfect square going out from the origin, so not really the 'radiating outwards' thing I was going for. Proof of concept though!

``` javascript

function setDistanceFromOrigin(cell) {
    cellRow = getRow(cell);
    cellColumn = getColumn(cell);
    cell.classList.add('dAssigned');
    columnDistance = (Math.abs(cellColumn - originArray[1]));
    rowDistance = (Math.abs(cellRow - originArray[0]));
    greaterDistance = Math.max(columnDistance,rowDistance);
    averageDistance = Math.floor((columnDistance+rowDistance)/2);
    cell.classList.add(`.distance${averageDistance+greaterDistance}`);
    distanceArray.push(averageDistance+greaterDistance);
}

```


## Async (or swim)!

(Coming soon! Write up on learning async and sleep functions for creating/deleting the little asterisk sparkles that show up on vacant cells.)

## Making a Pond

(Coming soon! Write up on creating a random blob of adjacent cells, including a random starting location and shape, as well as tweaking parameters so that it visually reads as 'pond' for the user).   

## Trees

(Section intro coming soon!)

#### Trees - Placement

(Oops also coming soon!)

#### Trees - Shapes!

How do I make a tree? When was the last time I saw a tree?

(I'm joking - despite living in DC, I actually have a nice big pine tree right in front of my desk window.)

From figuring out how to get cells adjacent to any given cell (from making the process of making the pond), I knew that I could get a certain sub-set of cells based on whatever origin point I wanted.

If I treated each random cell where a tree was placed as an origin cell, I could iterate off of that in a pattern to make a shape that is larger than the one main cell initially selected.

As an amateur arborist, I know all trees follow roughly the format below.

| left | center | right |
|:------------------------------:	|:-----------------------------:	|:------------------------------:	|
| x x x<br>x x x<br>x x x 	| x x x<br>x x x<br>x x x 	| x x x<br>x x x<br>x x x 	|
| x x x<br>x x x<br>x x x 	| x x x<br>x x x<br>x x x 	| x x x<br>x x x<br>x x x 	|
| x x x<br>x x x<br>x x x 	| x x x<br>x x x<br>x x x 	| x x x<br>x x x<br>x x x 	|
|                                	| x x x<br>x x x<br>x x x 	|                                	|

Which can then, very arboreally accurately, be named:


| left | center | right |
|:-----------:|:-----------:|:-----------:|
| *tip<br>top<br>left*| *tip<br>top* | *tip<br>top<br>right* |
| *top<br>left* | *top* | *top<br>right* |
| *middle<br>left* | *middle* | *middle<br>right* |
| | &nbsp; <br> *bottom* <br> &nbsp; | |


And then combining this pattern (abbreviated a bit) with the way that subcells are identified, I ended up with a way of pointing to any sub-cell in this tree-shaped pattern - relative to wherever the origin of the tree is:



| left | center | right |
|:---------------------------------------:	|:--------------------------------------:	|:---------------------------------------:	|
| <br>11-ttl 21-ttl 31-ttl<br>12-ttl 22-ttl 32-ttl<br>13-ttl 23-ttl 33-ttl <br>	| <br>11-tt 21-tt 31-tt<br>12-tt 22-tt 32-tt<br>13-tt 23-tt 33-tt <br>	| <br>11-ttr 21-ttr 31-ttr<br>12-ttr 22-ttr 32-ttr<br>13-ttr 23-ttr 33-ttr 	|
|  <br>11-tl 21-tl 31-tl<br>12-tl 22-tl 32-tl<br>13-tl 23-tl 33-tl 	|  <br>11-t 21-t 31-t<br>12-t 22-t 32-t<br>13-t 23-t 33-t 	|  <br>11-tr 21-tr 31-tr<br>12-tr 22-tr 32-tr<br>13-tr 23-tr 33-tr 	|
|  <br>11-ml 21-ml 31-ml<br>12-ml 22-ml 32-ml<br>13-ml 23-ml 33-ml 	|  <br>11-m 21-m 31-m<br>12-m 22-m 32-m<br>13-m 23-m 33-m 	|  <br>11-mr 21-mr 31-mr<br>12-mr 22-mr 32-mr<br>13-mr 23-mr 33-mr 	|
| |  <br>11-b 21-b 31-b<br>12-b 22-b 32-b<br>13-b 23-b 33-b 	|  

From here, I didn't want each tree to be fully random and have the whole thing appear as a mess of blobs - so I went about using this pattern to define a few shapes, like so:

``` javascript
let trunkPattern1 = [`11-m`,`12-m`,`13-m`,`22-m`,`23-m`,
`11-b`,`12-b`,`13-b`,`21-b`,`22-b`,`23-b`];

let leafPattern1 = [`33-ttl`,`12-tt`,`22-tt`,`32-tt`,`13-tt`,
`23-tt`,`33-tt`,`13-ttr`,`22-tl`,`31-tl`,`32-tl`,`33-tl`,`11-t`,
`21-t`,`31-t`,`12-t`,`22-t`,`32-t`,`23-t`,`11-tr`,`21-tr`,`12-tr`
,`22-tr`,`23-tr`,`33-tr`,`21-m`,`31-mr`,`32-mr`,`13-t`,`33-t`,
`13-tr`,`21-mr`,`22-mr`,`33-mr`,`31-ml`];

let trunkPattern2 = [...]
let treePattern2 = [...]

etc
etc
```

Or in some very-organized and legible notes:

<img src="https://user-images.githubusercontent.com/17027357/184696682-d5a1d006-b9e6-4209-8d39-da968c0e9373.jpg" width="400" />

<img src="https://user-images.githubusercontent.com/17027357/184696702-84828e25-2b73-4c87-9f6e-18927ae0c840.jpg" width="400" />

From there came the functions for breaking up each cell into sub-cells and assigning them an address (this is for the 'middle' cell in each tree, but same general pattern applies to each cell and would like to get a function going for at some point):

``` javascript
let middleTreeCell;

middleTreeCell = document.getElementById(getCellAboveID(bottomTreeCell));
middleTreeCell.classList.add(`treeCell`,`treeCellMiddle`,`treeCounter${treeCounter}`,`treePattern${treePattern}`);
for (let i = 0; i < 3; i++) {
    let treeCellRow = document.createElement('div');
    middleTreeCell.appendChild(treeCellRow);
    treeCellRow.classList.add(`treeCellRow`);

    for (let j = 0; j < 3; j++) {
        let treeCellSubCell = document.createElement('div');
        let parentCellDistance = "";
        treeCellRow.appendChild(treeCellSubCell);
        treeCellSubCell.setAttribute(`id`,`${middleTreeCell.id}-s${i+1}${j+1}`);
        treeCellSubCell.classList.add(`subCell`, `treeCellSubCell`,`treeCellMiddle`,`treeCounter${treeCounter}`,`treeCellSubCell${i+1}${j+1}-m`,`treePattern${treePattern}`);
      }
}
```

And finally, the function to assign the colors now that each subcell contains the information about what pattern it is a part of and where in that pattern it is. The code essentially iterates through the `leafpatterns` that match up with `getChanceOfEachTreePattern()` - which just picks a number 1-4. The other things going on are assigning the subCells `brightness(0%)`, and doing this with the subCells that are *not* the tree or trunk, so they also end up being assigned '`brightness(0%)`':

``` javascript
let treeCellSubCells2= document.querySelectorAll(`.treePattern2`).forEach((el) => {
      for (let p = 0; p <= leafPattern2.length-1; p++){
        if (
          (el.classList.contains(`treeCellSubCell${leafPattern2[p]}`)) && (el.classList.contains(`colorAssigned`) == false)
        ) {
          el.style.backgroundColor = leafColor;
          el.style.filter = `brightness(0%)`;
          el.classList.add(`colorAssigned`);
          if(subCellColorMap.has(`${el.id}`)) {
          } else {
            subCellColorMap.set(`${el.id}`,`${leafColor}`);
          }

        }
      }

      for (let t = 0; t <= trunkPattern2.length-1; t++){
        if ((el.classList.contains(`treeCellSubCell${trunkPattern2[t]}`)) && (el.classList.contains(`colorAssigned`) == false)) {
          el.style.backgroundColor = trunkColor;
          el.style.filter = `brightness(0%)`;
          el.classList.add(`colorAssigned`);
          if(subCellColorMap.has(`${el.id}`)) {
          } else {
            subCellColorMap.set(`${el.id}`,`${trunkColor}`);
          }

        }
      }

      for (let x = 0; x <= leafPattern2Opposite.length-1; x++){
        if (el.classList.contains(`treeCellSubCell${leafPattern2Opposite[x]}`)) {
          el.style.filter = `brightness(0%)`;
        }
      }

      for (let y = 0; y <= trunkPattern2Opposite.length-1; y++){
        if (el.classList.contains(`treeCellSubCell${trunkPattern2Opposite[y]}`)) {
          el.style.filter = `brightness(0%)`;
        }
      }
});
```

And that's how you make a tree! Ta-da!

### Tree perspective - Stickers

Now that trees were being placed and shaped and colored, the next goal was to create a sense of overlap, density, and perspective.

I realized that if I wanted to simulate a sort-of top-down-angle view, the trees that are *lower* in the grid need to appear to be in front the ones that are higher in the grid.

What made this problem click for me was imagining each tree placed as a rectangular sticker, overlapping haphazardly with the ones behind it - think stickers made from USPS shipping labels in a dive bar bathroom here. When one tree was rendered, another could be rendered in a position that would overlap, and get slapped down on top of it. The problem was, the 'background' sub-cells of trees would overwrite the non-background sub-cells of trees they were placed on, so there was no illusion of depth or being able to see one tree behind another.

Essentially, if I could figure out how to cut away the background of each tree so it doesn't get a new color assigned to it, and then overlap them, I'd get the perspective illusion I wanted.

Think stickers that are shaped to the 'content' of the sticker (like fancy stickers cut with a cool sticker cutting machine), with no background. You stack a bunch of these randomly on top of each other, you'll get little gaps and holes where you can enough of a glimpse of the ones behind it to know that they have concrete shapes and colors, even without their entire shapes being visible.

At this point (or really more after many hours of banging my head against the wall on this), I realized that there were two options that I could conceivably take for addressing this:
  1. I could have my tree generation loop start from the *top* of the grid and work it's way down. With this option, I would need to overwrite any already-generated sub-cells with any newer ones that get rendered.
  2. I could have my tree generation loop start from the *bottom* of the grid and work it's way up. With this option, I would need to *prevent* any more recently generated sub-cells from overwriting already rendered ones.

What I ended up with on this is the *first time* a sub-cell is assigned a color, it would get pushed to a hash storing the address as the key, and the color as the value. Whenever another tree is placed that would overlap and rewrite that subcell, it does actually overwrite it, BUT the subcell and color do not get added into that hash - as a subcell is only added the *first time* it is a assigned a color.

So! It was just a matter of writing a pretty short function that runs after everything gets placed, and then reassigns each subcell to the first color it was assigned - meaning nothing placed *earlier* can be overwritten by anything placed *later*, so every tree that is lower will always appear in front of every tree that is higher, creating a neat perspective illusion.

``` javascript
function reassignSubCellColors(){
  subCellColorMap.forEach(function(value,key) {
    let cellToReassign = document.getElementById(`${key}`);
    cellToReassign.style.backgroundColor = `${value}`;
    cellToReassign.classList.add(`colorAssigned`);
  })
}
```

## Trail

Is there definitely an easier way to do this? Definitely there is an easier way to do this.

Was I fast approaching the start of classes and just wanted to get *a* solution working? I was fast approaching the start of classes and just wanted to get *a* solution working.

What I wanted to make here was a randomly generated trail that would start at an edge and follow a random path that *looks nice*, as in no harsh zig-zags or patterns that aren't clearly identifiable as 'trail'.

I started out by breaking the edges up into eight quadrants (top-left, top-right, right-top, right-bottom, bottom-right, bottom-left, left-bottom, left-top), and randomly selecting two that were not on the same side - so the trail would have to start on one side and end on another.

``` javascript
let choicesArray = [];

function setTrailStartAndEndQuadrants() {
  choicesArray = [1,2,3,4,5,6,7,8];
  shuffleArray(choicesArray);

  if (choicesArray[0] == 1){
    choicesArray.splice(choicesArray.indexOf(2),1)
  } else if (choicesArray[0] == 2) {
    choicesArray.splice(choicesArray.indexOf(1),1)
  } else if (choicesArray[0] == 3) {
    choicesArray.splice(choicesArray.indexOf(4),1)
  } else if (choicesArray[0] == 4) {
    choicesArray.splice(choicesArray.indexOf(3),1)
  } else if (choicesArray[0] == 5) {
    choicesArray.splice(choicesArray.indexOf(6),1)
  } else if (choicesArray[0] == 6) {
    choicesArray.splice(choicesArray.indexOf(5),1)
  } else if (choicesArray[0] == 7) {
    choicesArray.splice(choicesArray.indexOf(8),1)
  } else if (choicesArray[0] == 8) {
    choicesArray.splice(choicesArray.indexOf(7),1)
  }
  return choicesArray.slice(0,2);
}
```



## Place Rocks?
So the appearance of this is pretty phoned in compared to everything else, and admittedly it was on the easier end of the struggle spectrum, but I am happy to have figured it out.

It's less about the shapes and colors of each individual rock that gets placed, but more was about figuring out how to identify cells that were 'vacant', meaning that there was no other object occupying the cell.

(Whoops that's all I've got right now, but will update when/if I have time!)
