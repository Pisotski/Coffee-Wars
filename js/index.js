// string. "darth-vader"
let selectedCharsId
// dom element
// <div id="tattoine-planet-wrapper">...</div>
let currentPlanet
// boolean
let isCurrentPlanetDisplayed = false
// create a store to prevent unnesessary fetching.
const charsStore = {

    // key: name-tolowercase-with-dashes
    // value: key-bio-wrapper
    
    //  r2-d2: "r2-d2-bio-wrapper",
    //  darth-vader: "darth-vader-bio-wrapper"

}

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

function hideloader () {

    document.getElementById('loading').style.display = 'none'
}

const createDropdown = function (data, key1, key2) {

    // error handling if no data received
    if (!data) return

    // create a list of bulletpoints to use them in dropdown menu
    // create a dropdown menu
    const formWrapper = document.getElementById('form-wrapper')
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
            select.append(option)
        })
        const defaultOption = defaultOptionElementForDropdown()
        select.append(defaultOption)
    }
    createOptions()

    show (formWrapper, form)
}

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
        
    const propertiesLi = document.createElement('li')
    propertiesLi.setAttribute('id', `${spacesToDashes(nameLi)}-${spacesToDashes(leftLi)}`)
    const leftTextReady = normalizeText(leftLi)

    if (rightLi instanceof Element) {
        propertiesLi.innerText = `${leftTextReady} : `
        propertiesLi.appendChild(rightLi)
    } else if (typeof rightLi === 'string') {
        propertiesLi.innerText = `${leftTextReady} : ${rightLi}`
    }
    return propertiesLi
}

// API call
// passed from createList function
const createHomeWorld = function (homeWorldName, list, id) {

    getapi(homeWorldName)
    .then(planet => {

        currentPlanet = createPlanet(planet)
        const planetName = planet.result.properties.name
        const spanPlanet = document.createElement('span')
        const charParent = document.getElementById(id).parentNode

        spanPlanet.textContent = planetName
        spanPlanet.addEventListener('click', handlePlanetClick)
        spanPlanet.setAttribute('class', 'planet-name-interactable')

        planetReady = createLi('homeworld', spanPlanet, spacesToDashes(planetName))
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
    const heroWrapperId = `${heroNameStandard}-bio-wrapper`
    charsStore[heroNameStandard] = heroWrapperId
    bioWrapper.setAttribute('id', heroWrapperId)
    const bioList = createList(heroName, bioClean, 'char-ul')
    bioWrapper.appendChild(bioList)

    return bioWrapper
}

const show = function (parent, module) {

    parent.appendChild(module)
    return
}

// helper function to make 
// all letters to lowercase and 
// to swap spaces with dashes for better navigation and consistency
const spacesToDashes = function (string) {

    if (typeof(string) !== 'string' && !string ) {
        console.error('Must be a string')
        return 
    }

    string = string.toLowerCase()
    return `${string.split(' ').join('-')}`
}

const normalizeText = function(string) {
    
    if (typeof string !== 'string') return

    const splittedString = string.split('')
    return splittedString.map((char, i) => 
        {
        if (i === 0 || splittedString[i-1] === '_') return char.toUpperCase()
        if (char === '_')  return ' ' 
        return char
    })
    .join('')
}

const removeKeys = function (obj, keys) {
    
    // both arguments must be objects
    const cleanObj = {}
    for(let key in obj) {
        if(!keys[key]) {
            cleanObj[key] = obj[key]
        }
    }
    return cleanObj
}
// on click get information and display it

// API CALL
const handleDropdownSelect = function (e) {
    e.preventDefault()
    // hide previous results if any
    // toggle current planet visibility a planet
    if (selectedCharsId !== undefined) {

        const toHideCharactersWrapper = document.getElementById(selectedCharsId).parentNode
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
        
        const storedCharacterNode = document.getElementById(charsStore[selectedCharsId])
        const toShowPlanetCharacterWrapper = storedCharacterNode.parentNode
        console.log(toShowPlanetCharacterWrapper) 
        toShowPlanetCharacterWrapper.style.display = 'block'
        currentPlanet = storedCharacterNode.nextElementSibling
        return
    }
    
    // if selecter character is not in the store, create new bio and planet
    const optionUrl = e.target[optionNum].getAttribute('url')
    const wrapper = document.getElementById('form-wrapper')
    const charPlanetWrapper = document.createElement('div')
    
    charPlanetWrapper.setAttribute('class', 'character-planet-wrapper')
    getapi(optionUrl)
    .then(data => {
        show(charPlanetWrapper, createBio(data))
        show(wrapper, charPlanetWrapper)
    })
    .catch(error => console.error(`FAILED TO LOAD THE MODULE: CHARACTER ${error}`))

}
const hideSelectedWrapper = function() {

}

const showSelectedWrapper = function() {

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

// API CALL
const showDropDown = getapi(starWarsUrl.people)
    .then(data => createDropdown(data,'name','url'))
    .catch(error => console.error(`FAILED TO LOAD THE MODULE: DROPDOWN MENU ${error}`))
