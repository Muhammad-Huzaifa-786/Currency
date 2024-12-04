const apiKey = "0df2ae0569ddb7f5b771e79f"; // Replace with your API key
const baseCurrency = "USD";
const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;
const ratesTable = document.querySelector("#ratesTable tbody");
const fromCurrencySelect = document.getElementById("from-currency");
const toCurrencySelect = document.getElementById("to-currency");
const amountInput = document.getElementById("amount");
const currencyConvertedAmount = document.getElementById("currency-converted-amount");
const currentTimeElement = document.getElementById("current-time");

let exchangeRates = {};
let dat;
let da;
async function fetchExchangeRates() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        dat = data.time_last_update_utc
        if (dat) {
            da = dat.slice(0, 16);  // Extract only the date portion (YYYY-MM-DD)
        } 

        if (data.result === "success") {
            exchangeRates = data.conversion_rates;
            populateCurrencySelects(data.conversion_rates);
            populateRatesTable(data.conversion_rates, data.time_last_updated);


        } else {
            ratesTable.innerHTML = `<tr><td colspan="3">Error fetching rates. Please check your API key.</td></tr>`;
        }
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
        ratesTable.innerHTML = `<tr><td colspan="3">An error occurred while fetching data.</td></tr>`;
    }
}

function populateCurrencySelects(rates) {
    const currencyList = Object.keys(rates);
    fromCurrencySelect.innerHTML = "";
    toCurrencySelect.innerHTML = "";

    currencyList.forEach(currency => {
        const option = document.createElement("option");
        option.value = currency;
        option.textContent = currency;
        fromCurrencySelect.appendChild(option);
        toCurrencySelect.appendChild(option.cloneNode(true));
    });

    // Set default selections
    fromCurrencySelect.value = "USD";
    toCurrencySelect.value = "PKR";

    // Perform initial calculations
    calculateCurrencyToCurrency();
}
const searchFromCurrencyInput = document.getElementById("search-from-currency");
const searchToCurrencyInput = document.getElementById("search-to-currency");

// Function to filter dropdown options
function filterCurrencyOptions(searchInput, dropdown, rates) {
    const query = searchInput.value.toLowerCase();
    dropdown.innerHTML = ""; // Clear existing options

    Object.keys(rates).forEach(currency => {
        if (currency.toLowerCase().includes(query) || getCountryNameByCurrency(currency).toLowerCase().includes(query)) {
            const option = document.createElement("option");
            option.value = currency;
            option.textContent = currency;
            dropdown.appendChild(option);
        }
    });

    if (dropdown.options.length > 0) {
        dropdown.value = dropdown.options[0].value; // Set the first option as selected
    }

    calculateCurrencyToCurrency(); // Recalculate conversion with filtered dropdown
}

// Attach event listeners to search inputs
searchFromCurrencyInput.addEventListener("input", () => {
    filterCurrencyOptions(searchFromCurrencyInput, fromCurrencySelect, exchangeRates);
});

searchToCurrencyInput.addEventListener("input", () => {
    filterCurrencyOptions(searchToCurrencyInput, toCurrencySelect, exchangeRates);
});

// Update the `populateCurrencySelects` function to allow dynamic filtering
function populateCurrencySelects(rates) {
    filterCurrencyOptions(searchFromCurrencyInput, fromCurrencySelect, rates);
    filterCurrencyOptions(searchToCurrencyInput, toCurrencySelect, rates);
}

// Search input element
const searchInput = document.getElementById("searchcurrency");
// Add event listener for search input
searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase(); // Get the lowercase search query
    const rows = ratesTable.getElementsByTagName("tr"); // Get all table rows

    Array.from(rows).forEach((row, index) => {
        if (index === 0) return; // Skip the header row
        const currencyCode = row.cells[0].textContent.toLowerCase(); // Get currency code
        const countryName = row.cells[2].textContent.toLowerCase(); // Get country name

        // Check if query matches currency code or country name
        if (currencyCode.includes(query) || countryName.includes(query)) {
            row.style.display = ""; // Show row if it matches
        } else {
            row.style.display = "none"; // Hide row if it doesn't match
        }
    });
});

function populateRatesTable(rates, lastUpdated) {
    ratesTable.innerHTML = ""; // Clear previous rows
    Object.entries(rates).forEach(([currency, rate]) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${currency}</td>
            <td>${rate.toFixed(4)}</td>
            <td>${getCountryNameByCurrency(currency)}</td>
        `;
        ratesTable.appendChild(row);
    });
    displayExchangeRateDate(lastUpdated);
}

function displayExchangeRateDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const dateString = date.toLocaleString();

    currentTimeElement.textContent = `Rates Last Updated: ${da}`;
}

function getCountryNameByCurrency(currency) {
    const countryNames = {
        USD: "United States",
        AED: "United Arab Emirates",
        AFN: "Afghanistan",
        ALL: "Albania",
        AMD: "Armenia",
        ANG: "Netherlands Antilles",
        AOA: "Angola",
        ARS: "Argentina",
        AUD: "Australia",
        AWG: "Aruba",
        AZN: "Azerbaijan",
        BAM: "Bosnia and Herzegovina",
        BBD: "Barbados",
        BDT: "Bangladesh",
        BGN: "Bulgaria",
        BHD: "Bahrain",
        BIF: "Burundi",
        BMD: "Bermuda",
        BND: "Brunei",
        BOB: "Bolivia",
        BRL: "Brazil",
        BSD: "Bahamas",
        BTN: "Bhutan",
        BWP: "Botswana",
        BYN: "Belarus",
        BZD: "Belize",
        CAD: "Canada",
        CDF: "Democratic Republic of Congo",
        CHF: "Switzerland",
        CLP: "Chile",
        CNY: "China",
        COP: "Colombia",
        CRC: "Costa Rica",
        CUP: "Cuba",
        CVE: "Cape Verde",
        CZK: "Czech Republic",
        DJF: "Djibouti",
        DKK: "Denmark",
        DOP: "Dominican Republic",
        DZD: "Algeria",
        EGP: "Egypt",
        ERN: "Eritrea",
        ETB: "Ethiopia",
        EUR: "Eurozone",
        FJD: "Fiji",
        FKP: "Falkland Islands",
        FOK: "Faroe Islands",
        GBP: "United Kingdom",
        GEL: "Georgia",
        GGP: "Guernsey",
        GHS: "Ghana",
        GIP: "Gibraltar",
        GMD: "Gambia",
        GNF: "Guinea",
        GTQ: "Guatemala",
        GYD: "Guyana",
        HKD: "Hong Kong",
        HNL: "Honduras",
        HRK: "Croatia",
        HTG: "Haiti",
        HUF: "Hungary",
        IDR: "Indonesia",
        ILS: "Israel",
        IMP: "Isle of Man",
        INR: "India",
        IQD: "Iraq",
        IRR: "Iran",
        ISK: "Iceland",
        JMD: "Jamaica",
        JOD: "Jordan",
        JPY: "Japan",
        KES: "Kenya",
        KGS: "Kyrgyzstan",
        KHR: "Cambodia",
        KMF: "Comoros",
        KRW: "South Korea",
        KWD: "Kuwait",
        KYD: "Cayman Islands",
        KZT: "Kazakhstan",
        LAK: "Laos",
        LBP: "Lebanon",
        LKR: "Sri Lanka",
        LRD: "Liberia",
        LSL: "Lesotho",
        LTC: "Litecoin",
        LTL: "Lithuania",
        LVL: "Latvia",
        MAD: "Morocco",
        MDL: "Moldova",
        MGA: "Madagascar",
        MKD: "North Macedonia",
        MMK: "Myanmar",
        MNT: "Mongolia",
        MOP: "Macau",
        MRU: "Mauritania",
        MUR: "Mauritius",
        MVR: "Maldives",
        MWK: "Malawi",
        MXN: "Mexico",
        MYR: "Malaysia",
        MZN: "Mozambique",
        NAD: "Namibia",
        NGN: "Nigeria",
        NIO: "Nicaragua",
        NOK: "Norway",
        NPR: "Nepal",
        NZD: "New Zealand",
        OMR: "Oman",
        PAB: "Panama",
        PEN: "Peru",
        PGK: "Papua New Guinea",
        PHP: "Philippines",
        PKR: "Pakistan",
        PLN: "Poland",
        PYG: "Paraguay",
        QAR: "Qatar",
        RON: "Romania",
        RSD: "Serbia",
        RUB: "Russia",
        RWF: "Rwanda",
        SAR: "Saudi Arabia",
        SBD: "Solomon Islands",
        SCR: "Seychelles",
        SEK: "Sweden",
        SGD: "Singapore",
        SHP: "Saint Helena",
        SLL: "Sierra Leone",
        SOS: "Somalia",
        SRD: "Suriname",
        SSP: "South Sudan",
        STN: "São Tomé and Príncipe",
        SYP: "Syria",
        SZL: "Eswatini",
        THB: "Thailand",
        TJS: "Tajikistan",
        TMT: "Turkmenistan",
        TND: "Tunisia",
        TOP: "Tonga",
        TRY: "Turkey",
        TTD: "Trinidad and Tobago",
        TWD: "Taiwan",
        TZS: "Tanzania",
        UAH: "Ukraine",
        UGX: "Uganda",
        USD: "United States",
        UYU: "Uruguay",
        UZS: "Uzbekistan",
        VEF: "Venezuela",
        VND: "Vietnam",
        VUV: "Vanuatu",
        WST: "Samoa",
        XCD: "East Caribbean",
        YER: "Yemen",
        ZAR: "South Africa",
        ZMW: "Zambia",
        ZWD: "Zimbabwe"
    };

    return countryNames[currency] || currency; // Fallback to currency code if not found
}

function calculateCurrencyToCurrency() {
    const fromCurrency = fromCurrencySelect.value;
    
    const toCurrency = toCurrencySelect.value;
    const amount = parseFloat(amountInput.value);

    if (exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
        const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
        const convertedAmount = (amount * rate).toFixed(2) || 0 ;
        currencyConvertedAmount.innerHTML = `<b>${amount} ${fromCurrency}</b> Equal to <b> ${convertedAmount} ${toCurrency}</b>`;
    }
}

// Event Listeners
fromCurrencySelect.addEventListener("change", calculateCurrencyToCurrency);
toCurrencySelect.addEventListener("change", calculateCurrencyToCurrency);
amountInput.addEventListener("input", calculateCurrencyToCurrency);

// Initial fetch
fetchExchangeRates();
