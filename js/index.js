// string. "darth-vader"
let selectedCharsId

// dom element
// <div id="tattoine-planet-wrapper">...</div>
let currentPlanet

// boolean
let isCurrentPlanetDisplayed = false

// create a store to prevent unnesessary fetching
const charsStore = {

    // key: name-tolowercase-with-dashes
    // value: <div id="key-bio-wrapper">...</div>,
    
    //  r2-d2: <div id="r2-d2-bio-wrapper">...</div>,
    //  darth-vader: <div id="darth-vader-bio-wrapper">...</div>,

}

// parent node for main content
const mainWrapper = document.getElementById('form-wrapper')

const starWarsUrl = {
    people: "https://www.swapi.tech/api/people",
    planets: "https://www.swapi.tech/api/planets"
}

async function getapi (url) {

    if (typeof (url) !== 'string') console.error('invalid url')
    try {
        const response = await fetch(url)
        const data = await response.json()
        if (response) {
            hideloader()
        }
        return data
    } catch (err) {
        console.error(`FAILED TO FETCH ${err}`)
    }
}

// >>> [TEMPLATES] for DOM elements to change properties if needed
const formTemplate = function() {

    const form = document.createElement('form')
    form.setAttribute('id', 'characters-list-form')
    return form
}

const selectTemplate = function() {

    const select = document.createElement('select')
    select.setAttribute('id', 'characters-list-select')
    select.addEventListener('change', handleDropdownSelect)
    return select
}

const defaultOptionElementForDropdown = function () {
    
    const defaultOption = document.createElement('option')
    defaultOption.setAttribute('value', 'none')
    defaultOption.setAttribute('label', 'Select a Character')
    defaultOption.setAttribute('class', 'default-option')
    defaultOption.selected = true
    defaultOption.disabled = true
    defaultOption.hidden = true
    return defaultOption
}
// <<< [TEMPLATES END]

// >>>[HELPER FUNCTIONS] to  
// make all letters to lowercase
// swap spaces with dashes for better navigation and consistency
const spacesToDashes = function (string) {

    if (typeof(string) !== 'string' && !string ) {
        console.error('Must be a string')
        return 
    }

    string = string.toLowerCase()
    return `${string.split(' ').join('-')}`
}

// display text with no underscores. and in Title Case
const normalizeText = function(string) {
    
    if (typeof(string) !== 'string' && !string ) {
        console.error('Must be a string')
        return 
    }

    const splittedString = string.split('')
    return splittedString.map((char, i) => 
        {
        if (i === 0 || splittedString[i-1] === '_') return char.toUpperCase()
        if (char === '_')  return ' ' 
        return char
    })
    .join('')
}

// remove unwanted information when data is received from the server
const removeKeys = function (obj, keys) {

    // both arguments must be objects
    // should add error handling
    const cleanObj = {}
    for (let key in obj) {
        if(!keys[key]) cleanObj[key] = obj[key]
    }
    return cleanObj
}

// display the block on the screen
const show = function (parent, module) {

    parent.appendChild(module)
    return
}

// hide the block
function hideloader () {

    document.getElementById('loading').style.display = 'none'
}
// <<< [HELPER FUNCTIONS END]


// >>>[MAIN LOGIC].
    // functions are called in this order
    // 'on-select' [API CALL 2]handleDropdownSelect => createBio => createList(biography) => createLi
    //              the last line in characters' biogaphy is a name of the planet (homeworld). here the third api call is made
    //              when createList function gets to the 'homeworld' line
    //              createList => [API CALL 3]createHomeWorld => createPlanet => createList(planet) => createLi

    // >>>[CREATORS] functions that create dom elements
        // After user choose a character from dropdown menu
        // Both lists [CHARACTERS BIO] and [PLANET INFO] are created.
        // [PLANET INFO] remains hidden
const createList = function (name, listItems, className) {

    // name = string, non-standartized
    // listItems = object
    // className = string, standard

    const list = document.createElement('ul')
    list.setAttribute('class', className)
    const standardName = spacesToDashes(name)
    list.setAttribute('id', standardName)
    list.innerText = name

    for (let key in listItems) {
        if(listItems[key] !== 'n/a') {
            if(key === 'homeworld') {
                createHomeWorld(listItems[key], list, charsStore[selectedCharsId])
            } else {
                const li = createLi(key, listItems[key], name);
                list.appendChild(li)  
            }
        }
    }
    return list
}

const createLi = function (leftLi, rightLi, nameLi) {
        
    const newLi = document.createElement('li')
    newLi.setAttribute('id', `${spacesToDashes(nameLi)}-${spacesToDashes(leftLi)}`)
    const leftTextReady = normalizeText(leftLi)

    if (rightLi instanceof Element) {
        newLi.innerText = `${leftTextReady} : `
        newLi.appendChild(rightLi)
    } else if (typeof rightLi === 'string') {
        newLi.innerText = `${leftTextReady} : ${rightLi}`
    }
    return newLi
}

//                                                              API CALL 3
const createHomeWorld = function (homeWorldName, list, charNode) {

    getapi(homeWorldName)
    .then(planet => {

        currentPlanet = createPlanet(planet)

        const planetName = planet.result.properties.name
        const spanPlanet = document.createElement('span')
        const charParent = charNode.parentNode
        const planetReady = createLi('homeworld', spanPlanet, planetName)


        spanPlanet.textContent = planetName
        spanPlanet.addEventListener('click', handlePlanetClick)
        spanPlanet.setAttribute('class', 'planet-name-interactable')

        list.appendChild(planetReady)

        show(charParent, currentPlanet)
    })
    .catch(error => console.error(`FAILED TO LOAD THE MODULE: PLANET ${error}`))
}

const createPlanet = function (planet) {

    const unwantedKeys = {
        "created": 1,
        "edited": 1,
        "name": 1,
        "url": 1
    }

    const planetName = planet.result.properties.name
    const planetClean = removeKeys(planet.result.properties, unwantedKeys)
    const planetList = createList(planetName, planetClean, 'planet-ul')
    const planetWrapper = document.createElement('div')
    planetWrapper.setAttribute('id', `${spacesToDashes(planetName)}-planet-wrapper`)
    planetWrapper.style.visibility = 'hidden'
    planetWrapper.appendChild(planetList)

    return planetWrapper
}

const createBio = function (bio) {

    // <div id="bio-wrapper">
    //    <ul id="${name}-bio-ul" label="name">
    //      <li id="${name}-${key}-li" class="${name}-bio-li">...</li></ul></div>

    const bioProperties = bio.result.properties
    const heroName = bioProperties.name
    const heroNameStandard = spacesToDashes(heroName)
    
    const unwantedKeys = {
        'name': 1,
        'created': 1,
        'edited': 1,
        'url': 1
    }
    const bioClean = removeKeys(bioProperties, unwantedKeys)
    const bioWrapper = document.createElement('div')
    // store biography parent node of a character
    charsStore[heroNameStandard] = bioWrapper

    const heroBioWrapperId = `${heroNameStandard}-bio-wrapper`
    bioWrapper.setAttribute('id', heroBioWrapperId)
    const bioList = createList(heroName, bioClean, 'char-ul')
    bioWrapper.appendChild(bioList)


    return bioWrapper
}
    // <<< [CREATORS END]

    // >>> [EVENT HANDLERS] START
//                                                              API CALL 2
const handleDropdownSelect = function (e) {
    e.preventDefault()

    // hide previous results if any
    // toggle current planet visibility
    if (selectedCharsId !== undefined) {

        const toHideCharactersWrapper = charsStore[selectedCharsId]
        const toHidePlanetWrapper = toHideCharactersWrapper.nextElementSibling
        const toHidePlanetCharacterWrapper = toHideCharactersWrapper.parentNode
        toHidePlanetCharacterWrapper.style.display = 'none'
        toHidePlanetWrapper.style.visibility = 'hidden'
        isCurrentPlanetDisplayed = false
    }
    
    // identify the character to be displayed
    const optionNum = e.target.selectedIndex

    // select or reassign a character
    // standartize it
    selectedCharsId = spacesToDashes(e.target[optionNum].label)
    
    // lookup the store
    // select DOM element if character is in the store
    // unhide the element
    // select current planet
    if (charsStore[selectedCharsId]) {
        
        const storedCharacterNode = charsStore[selectedCharsId]
        const toShowPlanetCharacterWrapper = storedCharacterNode.parentNode
        toShowPlanetCharacterWrapper.style.display = 'flex'
        currentPlanet = storedCharacterNode.nextElementSibling
        return
    }
    
    // if selected character is not in the store, create new bio and planet
    const optionUrl = e.target[optionNum].getAttribute('url')
    const charPlanetWrapper = document.createElement('div')
    charPlanetWrapper.setAttribute('class', 'character-planet-wrapper')
    
    getapi(optionUrl)
    .then(data => {

        // create list with characters biography
        const charBio = createBio(data)
        charPlanetWrapper.appendChild(charBio)
        
        show(mainWrapper, charPlanetWrapper)
    })
    .catch(error => console.error(`FAILED TO LOAD THE MODULE: CHARACTER ${error}`))
}

const handlePlanetClick = function (e) {
    e.preventDefault()

    if(!isCurrentPlanetDisplayed) {
        currentPlanet.style.visibility = 'visible'
    } else {
        currentPlanet.style.visibility = 'hidden'
    }
    isCurrentPlanetDisplayed = !isCurrentPlanetDisplayed
}
    // <<< [EVENT HANDLERS END]

// <<< [MAIN LOGIC END]

// >>> [INITIAL CALL] call for the names to the star wars server.
// display the menu with names

const createDropdown = function (data, key1, key2) {

    // error handling if no data received
    // should be better
    if (!data) return

    // create a list for dropdown menu
    // create a dropdown menu
    const form = formTemplate()
    const select = selectTemplate()
    form.appendChild(select)

    // populate the menu
    // flatten the array. make tuples [name and url]
    // assign attributes: name and url for each option
    const createOptions = function () {
    data.results
        .reduce((memo, obj) => memo.concat([[obj[key1], obj[key2]]]), [])
        .forEach((el) => {
            const option = document.createElement('option')
            const charName = el[0]
            const charURL = el[1]
            option.setAttribute('label', charName)
            option.setAttribute('url', charURL)
            select.appendChild(option)
        })
        const defaultOption = defaultOptionElementForDropdown()
        select.appendChild(defaultOption)
    }
    createOptions()

    show (mainWrapper, form)
}

//                                                              API CALL 1
const showDropDown = getapi(starWarsUrl.people)
    .then(data => createDropdown(data,'name','url'))
    .catch(error => console.error(`FAILED TO LOAD THE MODULE: DROPDOWN MENU ${error}`))
// <<< [INITIAL CALL ENDS]