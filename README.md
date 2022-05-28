# Intro

https://alepbloyd.github.io/forest_generator/

This randomly generates a forest when page loads and brightens in a radius around wherever the user clicks. It contains a number of random functions that build off of each other to:

1. Choose a season and set colors accordingly.
1. Place a pond of a random size and shape.
1. Place trees randomly across the cells, and choose from a selection of pre-defined shapes to render them.
1. Create a nice little trail that weaves between trees.
1. Generate sparkles (asterisks) in a few different patterns at random intervals on unoccupied cells.
1. Place little rudimentary rock shapes on a handful of random cells.

This is my first project, before learning any sort of organization or best practices, and mostly just an exercise in "Here's an idea. How far can I get in figuring out that idea with what I know + google?". So, expect some squiggly, messy, unoptimized, code in here - I would love to take a shot at refactoring this in the future though!

Below here is a rambly attempt to retrace my thought process in chronological order, from each feature to each feature, and what I remember about how I approached making each feature of this project.

(This is a work-in-progress, and will be updated when I have time between classes and projects at [Turing](https://www.turing.edu)!)

# Background

This is my first project, and hooooo boy I feel like I learned a lot while stumbling through this, and at least 75% of what I learned is what *not* to do in future projects.
- Maybe sticking all of my script into one file is not the right way to handle things?
- What the heck is a branch, or a commit, or git? Doesn't everyone code and hope that it works, break everything, try to fix it, get frustrated, and then hold down ```cmd+z``` for a few minutes to try to get back to a functional point and try to remember what aspects of what they did worked?
- What is 'planning ahead?'

The impetus for this project came from working through the *Foundations* course on [The Odin Project](https://www.theodinproject.com). Somewhere around the end of that course, there is a challenge to create a grid based on user input for number of rows and columns, with the goal of learning a bit of dom manipulation. After I figured out a way to do this (Flex-box-ing! Loops! Creating elements!), I was super excited thinking about the potential from that basic task as a starting point.

If I could generate a grid, and the grid makes each cell in it one-by-one (kind of?), then I could assign a unique identity to each cell as it's created, which then meant that I could do different things to each one depending on criteria that I could set.

I imagine for folks who have been programming for a while, that might seem almost self-evident - of course you can do a thing to a thing, duh - but that first glimpse of creative potential when learning a new skill feels wild and exciting. I'm new at this, but coding makes me feel creative in a way that feels slow and deliberate and satisfying.

## Brightness and Distance!

This was the first part that felt like it was going to be a challenge for me going into it, and hey it definitely was.

### Async (or swim)!

## Sparkles

## Making a Pond

## Trees

### Placement



### Shapes!

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

### Tree perspective - Stickers

Trees that don't overlap don't create perspective, and I wanted to create perspective.

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

## Place Rocks?
So the appearance of this is pretty phoned in compared to everything else, and admittedly it was on the easier end of the struggle spectrum, but I am happy to have figured it out.

It's less about the shapes and colors of each individual rock that gets placed, but more was about figuring out how to identify cells that were 'vacant', meaning that there was no other object occupying the cell.
