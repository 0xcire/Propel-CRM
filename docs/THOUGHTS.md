# Random Thoughts

...after abandoning the project for ~1 year and getting some real world experience!

Opening the repo for the first time after was hilarious... this code was interesting.

## What was Changed?

This was never intended to be a product. Just something to build which would eventually end up touching many different areas.
Some areas have not been reached, but I've learned maybe on the job for example. Message queue's being on of those areas.

Since this will never be productized, I will just be making some QOL improvements, altering deployment scripts to keep running on a small VPS, and doing some refactors.

This will serve as a decent example of my ability to do things in Express before showcasing Nestjs examples. For backend services where node is an acceptable choice, and based on my limited experience, its so hard to beat what Nest offers. (This experience being the only internship I've ever held, so take that w/ a grain of salt :D)

There are some glaringly bad design choices I made here which again, will not be addressed, but just discussed here.


### What is bad?

- Testing
    - Desire for integration testing made structure of monorepo not idealA
- Environment management is rather disgusting here
- Having entire application stack in monorepo isn't particularly bad but i think my overall archiecture choices using this approach were bad
    - find myself continually asking "why <insert nice words and phrases> did i do this"

