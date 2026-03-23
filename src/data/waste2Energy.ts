import L from 'leaflet';

export interface waste2Energy {
    id: string;
    position: L.LatLngExpression;
    name: string;
    details: string;
}

export const locations: waste2Energy[] = [

    {
        id: 'd-waste-1',
        position: [28.799073023548843, 77.06295933915875], //
        name: 'Re Sustainability IWM Solutions Limited',
        details: 'DSIIDC Industrial Area, Sector 5, Bawana, Delhi, 110039'
    },
    {
        id: 'd-waste-2',
        position: [28.637425203223522, 77.32440014190995],
        name: 'East Delhi Waste Processing Company Limited',
        details: 'Unnamed Road, Block A, Ghazipur Dairy Farm, Ghazipur, Gazipur, Delhi, 110091'
    },
    {
        id: 'd-waste-3',
        position: [28.5097499321658, 77.2807451103097],
        name: 'TWEPL - Tehkhand Waste to Electricity Project Limited',
        details: 'Ma Anandmayee Marg, Railway Colony, Tughlakabad, New Delhi, Delhi 110020'
    },
    {
        id: 'd-waste-4',
        position: [28.662807057812312, 77.1548926238101],
        name: 'Timarpur-Okhla Waste Management Company Ltd.',
        details: 'Jindal Saw Limited, ITF Centre, 28, Shivaji Marg, Block C, Najafgarh Road Industrial Area, New Delhi, Delhi, 110015'
    }
]