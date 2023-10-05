'use strict';

// eslint-disable-next-line no-unused-vars
const config = {
  style: 'mapbox://styles/mapbox/outdoors-v12',
  accessToken:
    'pk.eyJ1IjoicmFodWxzaGVrYXIzNiIsImEiOiJjbGkwN2V2bzQwMWFqM2VxdHN0d2JqYmNjIn0.80D19gZMovIsTUul0dxRfg',
  CSV: './Tourist_Data.csv',
  center: [78, 15],
  zoom: 6,
  title: 'Karnataka Travel Planner',
  description:
    'Choose the category of the destination, Also you can choose the utility type.',
  sideBarInfo: ['Location_Name', 'Type'],
  popupInfo: ['Location_Name'],
  filters: [
    {
      type: 'dropdown',
      title: 'Utilities',
      columnHeader: 'Utilities',
      listItems: [
        'atm',
        'Hotel',
        'Hospital',
        "Public Transport",
        "Fuel Station"
      ],
    },
    {
      type: 'checkbox',
      title: 'Destination Categories',
      columnHeader: 'Type', // Case sensitive - must match spreadsheet entry
      listItems: ['Heritage', 'Hiking', 'Spiritual','Beaches','Waterfalls',"National_Park","Water_Activities","none"], // Case sensitive - must match spreadsheet entry; This will take up to six inputs but is best used with a maximum of three;
    },
    // {
    //   type: 'dropdown',
    //   title: 'Clients: ',
    //   columnHeader: 'Clients',
    //   listItems: [
    //     'Adults',
    //     'Disabled',
    //     'Homeless',
    //     'Immigrants/Refugees',
    //     'Low Income',
    //     'Seniors',
    //     'Youth: Pre-teen',
    //     'Youth: Teen',
    //   ],
    // },
  ],
};
