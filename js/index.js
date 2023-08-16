const api_url_sw = "https://www.swapi.tech/api/"

const api_url_coffee = "https://sampleapis.com/api-list/coffee/"
// /hot or /iced

// helper function that makes a complete endpoint
const sw_url = function (api, endpoint) {
    return `${api}${endpoint}`
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

const characters = sw_url (api_url_sw, 'people')

let selectedChar
let currentPlanet
let isCurrentPlanetDisplayed = false
const charsStore = {}

const createDropdown = function (data, key1, key2) {
    // error handling if no data received
    if (!data) return

    // create a list of bulletpoints to use them in dropdown menu
    // create a dropdown menu
    const formWrapper = document.getElementById('form-wrapper')
    const form = document.createElement('form')
    const select = document.createElement('select')
    select.addEventListener('change', handleDropdownSelect)
    form.appendChild(select)

    // populate the menu
    // flatten the array. make tuples [name and url]
    // assign attributes name and url for each option
    const createOptions = function ( ) {
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
        const defaultOption = document.createElement('option')
        defaultOption.setAttribute('value', 'none')
        defaultOption.setAttribute('label', 'Select a Character')
        defaultOption.setAttribute('class', 'default-option')
        defaultOption.selected = true
        defaultOption.disabled = true
        defaultOption.hidden = true
        select.append(defaultOption)
    }
    createOptions()

    show (formWrapper, form)
}

const createList = function(name, listItems, className) {
    // name = string
    // listItems = object
    const list = document.createElement('ul')
    list.setAttribute('class', className)
    list.setAttribute('id', spacesToDashes(name))
    list.innerText = name

    for (let prop in listItems) {
        if(listItems[prop] !== 'n/a') {
            if(prop === 'homeworld') {
                createHomeWorld(listItems[prop], list, charsStore[selectedChar])
            } else {
                const li = createLi(prop, listItems[prop], name);
                list.appendChild(li)  
            }
        }
    }
    return list
}

const createLi = function (leftLi, rightLi, nameLi) {
        
    const propertiesLi = document.createElement('li')
    propertiesLi.setAttribute('id', `${spacesToDashes(nameLi)}-${spacesToDashes(leftLi)}`)
    
    if (rightLi instanceof Element) {
        propertiesLi.innerText = `${leftLi} : `
        propertiesLi.appendChild(rightLi)
    } else if (typeof rightLi === 'string') {
        propertiesLi.innerText = `${leftLi} : ${rightLi}`
    }
    return propertiesLi
}

const createHomeWorld = function(homeWorldName, list, id) {

    getapi(homeWorldName)
    .then(planet => {
        currentPlanet = createPlanet(planet)
        const planetName = planet.result.properties.name
        const spanPlanet = document.createElement('span')
        const charParent = document.getElementById(id).parentNode
        spanPlanet.textContent = planetName
        spanPlanet.addEventListener('click', handlePlanetClick)
        spanPlanet.setAttribute('class', 'planet')
        planetReady = createLi('homeworld', spanPlanet, spacesToDashes(planetName))
        list.appendChild(planetReady)
        show(charParent, currentPlanet)
    })
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

const createBio = function ( bio ) {

    // <div id="bio-wrapper">
    //    <ul id="${name}-bio-ul" label="name">
    //      <li id="${name}-${key}-li" class="${name}-bio-li">...</li></ul></div>

    const bioProperties = bio.result.properties
    const heroName = bioProperties.name
    const unwantedKeys = {
        'name': 1,
        'created': 1,
        'edited': 1,
        'url': 1
    }
    const bioClean = removeKeys(bioProperties, unwantedKeys)
    const bioWrapper = document.createElement('div')
    const heroId = `${spacesToDashes(heroName)}-bio-wrapper`
    charsStore[heroName] = heroId
    bioWrapper.setAttribute('id', spacesToDashes(heroId))
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

const handleDropdownSelect = function (e) {
    e.preventDefault()

    const optionNum = e.target.selectedIndex
    const selectedElement = document.getElementById(charsStore[selectedChar])

    //if character was already selected, hide it and it's sibling
    if (selectedChar !== undefined) {
        selectedElement.style.display = 'none'
        selectedElement.nextSibling.style.display = 'none'
    }

    //save and put in the store selected character
    selectedChar = e.target[optionNum].label
    if (charsStore[selectedChar]) {
        document.getElementById(charsStore[selectedChar]).style.visibility = 'visible'
        return
    }
    
    const optionUrl = e.target[optionNum].getAttribute('url')
    const wrapper = document.getElementById('form-wrapper')
    const charPlanetWrapper = document.createElement('div')
    charPlanetWrapper.setAttribute('class', 'character-planet-wrapper')
    getapi(optionUrl)
    .then(data => {
        show(charPlanetWrapper, createBio(data))
        show(wrapper, charPlanetWrapper)
    })
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

const showDropDown = getapi(characters)
    .then(data => createDropdown(data,'name','url'))