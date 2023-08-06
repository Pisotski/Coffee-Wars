const api_url_sw = "https://www.swapi.tech/api/"

const api_url_coffee = "https://sampleapis.com/api-list/coffee/"
// /hot or /iced

// helper function that makes a complete endpoint
const sw_url = function ( api, endpoint ) {
    return `${api}${endpoint}`
}

async function getapi (url) {

    if ( typeof ( url ) !== 'string' ) console.error( 'invalid url' )

    try {

        const response = await fetch ( url )
        
        const data = await response.json()
        console.log ( 'data received' )

        if ( response ) {
            hideloader()
        }

        return data ? data : response

    } catch ( err ) {
        console.error(`FAILED TO FETCH ${ err }`)
    }

}

// =====>>>> remake hide module
function hideloader () {
    document.getElementById( 'loading' ).style.display = 'none'
}

const characters = sw_url ( api_url_sw, 'people' )

const createDropdown = function ( data, key1, key2 ) {
    // error handling if no data received
    if ( !data ) { return }

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
        .reduce( (memo, obj) => memo.concat([[obj[key1], obj[key2]]]), [])
        .forEach( (el, i, list) => {
            const option = document.createElement('option')
            const charName = el[0]
            const charURL = el[1]
            option.setAttribute('label', charName)
            option.setAttribute('url', charURL)
            select.append(option)
        })
    }
    createOptions()

    show ( formWrapper, form )
}

const createBio = function ( bio ) {

    // in a perfect world keys and values must be tested 
    // for the sake of saving time for this project I've chosen not to dispay 
    // N/A is there is no value for a certain key 
    
    // Bio Template
    // {
    //     Name: string
    //     Birth Year: string
    //     Eye_color: string
    //     Gender: string
    //     Hair Color: string
    //     Height: string
    //     Homeworld: apicall -> string -> maybe hyperlink
    //     Skin Color: string
    // }

    // <div id="bio-wrapper">
    //    <ul id="${name}-bio-ul" label="name">
    //      <li id="${name}-${key}-li" class="${name}-bio-li">...</li></ul></div>

    console.log(bio)

    return document.createElement('div')
}

const show = function ( parent, module ) {
    parent.appendChild(module)
    return
}

const spacesToDashes = function ( string ) {
    // helper function to make 
    // all letters to lowercase and 
    // to swap spaces with dashes for better navigation and consistency

    typeof( string === "string") ? string : string.toSting()
    string = string.toLowerCase()
    return `${string.split(' ').join('-')}-`
}

// on click get information and display it
const handleDropdownSelect = function ( e ) {
    e.preventDefault()
    const optionNum = e.target.selectedIndex
    const optionUrl = e.target[optionNum].getAttribute('url')
    const mainWrapper = document.getElementById('main-wrapper')
    getapi(optionUrl)
    .then(data => show(mainWrapper, createBio(data)))
}
const showDropDown = getapi( characters ).then( ( data ) => createDropdown ( data, 'name', 'url' ) );
