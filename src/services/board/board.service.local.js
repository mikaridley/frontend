import { storageService } from '../async-storage.service'
import { loadFromStorage, makeId, saveToStorage } from '../util.service'

const STORAGE_KEY = 'boardDB'
const STORAGE_KEY_IMGS = 'imgsDB'
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY
_createBoards()

export const boardService = {
  query,
  getById,
  save,
  remove,
  addGroup,
  getEmptyBoard,
  getBackgrounds,
  getBoardBackgrounds,
}
window.bs = boardService

const gBackgrounds = {
  solidColors: [
    '#0079bf',
    '#d29034',
    '#519839',
    '#b04632',
    '#89609e',
    '#cd5a91',
    '#4bbf6b',
    '#00aecc',
    '#838c91',
  ],
  gradiantColors: [
    'linear-gradient(135deg, #1c2c44, #133160)',
    'linear-gradient(135deg, #0e6ae2, #33aec6)',
    'linear-gradient(135deg, #0c65e1, #093676)',
    'linear-gradient(135deg, #0e326d, #bd4f99)',
    'linear-gradient(135deg, #715dc6, #dd72bc)',
    'linear-gradient(135deg, #e34b35, #f89c3c)',
    'linear-gradient(135deg, #e874b9, #f77468)',
    'linear-gradient(135deg, #21865e, #5bc1ca)',
    'linear-gradient(135deg, #4f5e78, #1c2f51)',
    'linear-gradient(135deg, #45290e, #a42a18)',
  ],
}

async function query(filterBy = { txt: '' }) {
  var boards = await storageService.query(STORAGE_KEY)
  const { txt } = filterBy

  // if (txt) {
  //   const regex = new RegExp(filterBy.txt, 'i')
  //   boards = boards.filter(board => {
  //     // Check board name
  //     if (regex.test(board.title)) return true

  //     // Check group names
  //     if (board.groups && Array.isArray(board.groups)) {
  //       for (const group of board.groups) {
  //         if (group.name && regex.test(group.name)) return true

  //         // Check task names within groups
  //         if (group.tasks && Array.isArray(group.tasks)) {
  //           for (const task of group.tasks) {
  //             if (task.name && regex.test(task.name)) return true
  //             if (task.title && regex.test(task.title)) return true
  //           }
  //         }
  //       }
  //     }

  //     return false
  //   })
  // }

  // boards = boards.map(({ _id, name }) => ({ _id, name }))
  return boards
}

function getById(boardId) {
  return storageService.get(STORAGE_KEY, boardId)
}

async function remove(boardId) {
  await storageService.remove(STORAGE_KEY, boardId)
}

async function save(board) {
  var savedBoard
  if (board._id) {
    savedBoard = await storageService.put(STORAGE_KEY, board)
  } else {
    savedBoard = await storageService.post(STORAGE_KEY, board)
  }
  return savedBoard
}

async function addGroup(boardId, groupToAdd) {
  // Later, this is all done by the backend
  const board = await getById(boardId)

  const group = {
    _id: makeId(),
    name: groupToAdd.name,
  }
  board.groups.push(group)
  await storageService.put(STORAGE_KEY, board)

  return group
}

function getEmptyBoard() {
  return {
    isStarred: false,
    archivedAt: null,
    createdBy: {
      _id: '',
      fullname: '',
      imgUrl: '',
    },
    style: {
      background: { color: '', kind: '' },
    },
    labels: [],
    members: [],
    groups: [],
  }
}

async function getRandomBackground(count = 15) {
  console.log('fetching')
  const res = await fetch(
    `https://api.unsplash.com/photos/random?query=landscape&orientation=landscape&count=${count}`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_KEY}`,
      },
    }
  )

  const data = await res.json()

  return data.map(photo => ({
    id: photo.id,
    imageUrl: photo.urls.full,
    author: photo.user.name,
    authorLink: photo.user.links.html,
  }))
}

async function getBoardBackgrounds(count = 15) {
  const saved = localStorage.getItem(STORAGE_KEY_IMGS)

  if (saved) return JSON.parse(saved)

  const backgrounds = await getRandomBackground(count)

  localStorage.setItem(STORAGE_KEY_IMGS, JSON.stringify(backgrounds))

  return backgrounds
}

function getBackgrounds() {
  return gBackgrounds
}

function _createBoards() {
  let boards = loadFromStorage(STORAGE_KEY)
  if (!boards || !boards.length) {
    boards = []
    boards.push(_createBoard("New Zealand's Trip", true))
    boards.push(_createBoard('Learning how to code', false, '#cd5a91', 'solid'))
    boards.push(
      _createBoard(
        'Wedding',
        false,
        'linear-gradient(135deg, #e34b35, #f89c3c)',
        'gradiant'
      )
    )
    boards.push(
      _createBoard(
        'Presents',
        true,
        'linear-gradient(135deg, #21865e, #5bc1ca)',
        'gradiant'
      )
    )
    boards.push(
      _createBoard(
        'Surprise party',
        false,
        'linear-gradient(135deg, #0e6ae2, #33aec6)',
        'gradiant'
      )
    )
    saveToStorage(STORAGE_KEY, boards)
  }
}

function _createBoard(
  name = 'Board',
  isStarred = false,
  background = 'linear-gradient(135deg, #0e326d, #bd4f99)',
  kind = 'gradiant'
) {
  return {
    _id: makeId(),
    title: name,
    isStarred,
    archivedAt: null,
    createdBy: {
      _id: 'u101',
      fullname: 'Mika Haitner',
      imgUrl: 'http://some-img',
    },
    style: {
      background: {
        color: background,
        kind,
      },
    },
    labels: [],
    members: [
      {
        _id: 'u102',
        fullname: 'Ran Hirshorn',
        imgUrl: 'https://www.google.com',
      },
      {
        _id: 'u103',
        fullname: 'Asya Kandyba',
        imgUrl: 'https://www.google.com',
      },
    ],
    // groups: [
    //   {
    //     id: 'D2Y0Ys',
    //     title: 'Flights',
    //     archivedAt: null,
    //     tasks: [
    //       {
    //         id: '94WTmg',
    //         title: 'Tel Aviv to Thailand',
    //         dates: { dateTime: '2025-12-23T09:16:38.000Z' },
    //         labels: [
    //           { color: '#ae2e24', title: '', colorName: 'red' },
    //           { color: '#7f5f01', title: '', colorName: 'yellow' },
    //         ],
    //         description: '<p>hi</p>',
    //         comments: [
    //           { id: 'nlCgZG', text: '<p>hi</p>', createdAt: 1766308743797 },
    //         ],
    //         checklists: [
    //           {
    //             id: '1766308747119',
    //             name: 'hi',
    //             items: [
    //               { text: 'hi', isChecked: true },
    //               { text: 'hhi', isChecked: false },
    //             ],
    //           },
    //         ],
    //       },
    //       {
    //         id: 'K1aX2p',
    //         title: 'Return flight to Tel Aviv',
    //       },
    //     ],
    //   },
    //   {
    //     id: 'kiKKyz',
    //     title: 'Hotels',
    //     archivedAt: null,
    //     tasks: [
    //       {
    //         id: 'H12aLp',
    //         title: 'Book hotel in Bangkok',
    //       },
    //       {
    //         id: 'H98Ksd',
    //         title: 'Reserve resort in Phuket',
    //       },
    //     ],
    //   },
    //   {
    //     id: '1YXVeK',
    //     title: 'To do',
    //     archivedAt: null,
    //     tasks: [
    //       {
    //         id: 'aI7Tj4',
    //         title: 'Book international flights',
    //       },
    //       {
    //         id: 'Qp93Lm',
    //         title: 'Check visa requirements',
    //       },
    //     ],
    //   },
    //   {
    //     id: 'JZa1a9',
    //     title: 'Places I want to go',
    //     archivedAt: null,
    //     tasks: [
    //       {
    //         id: 'PL88sa',
    //         title: 'Phi Phi Islands',
    //       },
    //       {
    //         id: 'PL22Df',
    //         title: 'Chiang Mai night market',
    //       },
    //     ],
    //   },
    //   {
    //     id: 'sGgldB',
    //     title: 'To Pack',
    //     archivedAt: null,
    //     tasks: [
    //       {
    //         id: 'PK1Lm2',
    //         title: 'Passport',
    //       },
    //       {
    //         id: 'PK9Qa1',
    //         title: 'Travel adapter',
    //       },
    //     ],
    //   },
    //   {
    //     id: 'F8gI4G',
    //     title: 'FOOD',
    //     archivedAt: null,
    //     tasks: [
    //       {
    //         id: 'FD77Ss',
    //         title: 'Pad Thai',
    //       },
    //       {
    //         id: 'FD22Lp',
    //         title: 'Mango sticky rice',
    //       },
    //     ],
    //   },
    //   {
    //     id: 'X9Fun1',
    //     title: 'Experiences',
    //     archivedAt: null,
    //     tasks: [
    //       {
    //         id: 'EX01',
    //         title: 'Thai cooking class',
    //       },
    //       {
    //         id: 'EX02',
    //         title: 'Scuba diving day',
    //       },
    //     ],
    //   },
    // ],
    groups: [
      {
        id: 'G-NZ-01',
        title: 'Flights',
        archivedAt: null,
        tasks: [
          {
            id: 'T-FL-01',
            title: 'Book Tel Aviv → Auckland flight',
            labels: [
              { color: '#ae2e24', title: '', colorName: 'red' },
              { color: '#1558bc', title: '', colorName: 'blue' },
            ],
            description: '<p>Look for flights with 1 stop max.</p>',
            status: 'done',
            comments: [
              {
                id: 'C-FL-1',
                text: '<p>Booked via Qatar Airways, good layover time.</p>',
                createdAt: 1766308743797,
              },
            ],
            checklists: [
              {
                id: 'CL-FL-1',
                name: 'Booking checklist',
                items: [
                  { text: 'Baggage included', isChecked: true },
                  { text: 'Seats selected', isChecked: true },
                ],
              },
            ],
          },
          {
            id: 'T-FL-02',
            title: 'Internal flight: Auckland → Queenstown',
            dates: { dateTime: '2024-11-15T07:00:00.000Z' },
            labels: [{ color: '#7f5f01', title: '', colorName: 'yellow' }],
            description: '<p>Compare Jetstar and Air NZ.</p>',
            checklists: [],
          },
          {
            id: 'T-FL-03',
            title: 'Seat selection',
            labels: [{ color: '#216e4e', title: '', colorName: 'green' }],
            description: '<p>Aisle seats preferred.</p>',
            status: 'done',
          },
          {
            id: 'T-FL-04',
            status: 'done',
            title: 'Online check-in',
            dates: { dateTime: '2024-12-09T22:30:00.000Z' },
            labels: [{ color: '#803fa5', title: '', colorName: 'purple' }],
            description: '<p>48 hours before flight.</p>',
          },
          {
            id: 'T-FL-05',
            title: 'Download boarding passes',
            labels: [{ color: '#216e4e', title: '', colorName: 'green' }],
            description: '<p>Save offline.</p>',
            status: 'done',
          },
        ],
      },

      {
        id: 'G-NZ-02',
        title: 'Accommodation',
        archivedAt: null,
        tasks: [
          {
            id: 'T-AC-01',
            title: 'Hotel in Auckland (2 nights)',
            labels: [
              { color: '#1558bc', title: '', colorName: 'blue' },
              { color: '#7f5f01', title: '', colorName: 'yellow' },
            ],
            description: '<p>Near Sky Tower.</p>',
            status: 'done',
            checklists: [
              {
                id: 'CL-AC-1',
                name: 'Hotel needs',
                items: [
                  { text: 'Free cancellation', isChecked: true },
                  { text: 'Breakfast included', isChecked: false },
                ],
              },
            ],
          },
          {
            id: 'T-AC-02',
            status: 'done',
            title: 'Lodge in Queenstown',
            dates: { dateTime: '2024-11-18T15:00:00.000Z' },
            labels: [{ color: '#216e4e', title: '', colorName: 'green' }],
            description: '<p>Lake view preferred.</p>',
          },
          {
            id: 'T-AC-03',
            title: 'Motel in Wanaka',
            labels: [{ color: '#9e4c00', title: '', colorName: 'orange' }],
            description: '<p>Close to trails.</p>',
            comments: [
              {
                id: 'C-AC-1',
                text: '<p>Looks clean and well reviewed.</p>',
                createdAt: 1766308744000,
              },
            ],
          },
        ],
      },

      {
        id: 'G-NZ-03',
        title: 'Transport',
        archivedAt: null,
        tasks: [
          {
            id: 'T-TR-01',
            status: 'done',
            title: 'Rent car in Queenstown',
            dates: { dateTime: '2024-11-19T10:00:00.000Z' },
            labels: [
              { color: '#216e4e', title: '', colorName: 'green' },
              { color: '#1558bc', title: '', colorName: 'blue' },
            ],
            description: '<p>Automatic with insurance.</p>',
            checklists: [
              {
                id: 'CL-TR-1',
                name: 'Car rental',
                items: [
                  { text: 'Full insurance', isChecked: true },
                  { text: 'Unlimited mileage', isChecked: true },
                ],
              },
            ],
          },
          {
            id: 'T-TR-02',
            title: 'Driving rules review',
            labels: [{ color: '#7f5f01', title: '', colorName: 'yellow' }],
            description: '<p>Left-side driving.</p>',
            status: 'done',
          },
          {
            id: 'T-TR-03',
            title: 'Fuel & toll apps',
            dates: { dateTime: '2024-12-01T12:00:00.000Z' },
            labels: [{ color: '#803fa5', title: '', colorName: 'purple' }],
            description: '<p>Download offline maps.</p>',
          },
          {
            id: 'T-TR-04',
            title: 'Airport transfer in Auckland',
            labels: [{ color: '#9e4c00', title: '', colorName: 'orange' }],
            description: '<p>Uber or SkyBus.</p>',
            comments: [
              {
                id: 'C-TR-1',
                text: '<p>SkyBus seems cheaper.</p>',
                createdAt: 1766308745000,
              },
            ],
          },
          {
            id: 'T-TR-05',
            title: 'Return car inspection',
            dates: { dateTime: '2024-12-22T16:00:00.000Z' },
            labels: [{ color: '#ae2e24', title: '', colorName: 'red' }],
            description: '<p>Take photos.</p>',
            status: 'done',
          },
          {
            id: 'T-AC-04',
            title: 'Airbnb in Rotorua',
            dates: { dateTime: '2024-12-02T15:00:00.000Z' },
            labels: [{ color: '#803fa5', title: '', colorName: 'purple' }],
            description: '<p>Kitchen access.</p>',
            status: 'done',
          },
          {
            id: 'T-AC-05',
            title: 'Confirm all reservations',
            labels: [{ color: '#ae2e24', title: '', colorName: 'red' }],
            description: '<p>Verify payments.</p>',
          },
        ],
      },

      {
        id: 'G-NZ-04',
        title: 'Activities',
        archivedAt: null,
        tasks: [
          {
            id: 'T-ACT-01',
            title: 'Milford Sound cruise',
            labels: [{ color: '#1558bc', title: '', colorName: 'blue' }],
            description: '<p>Morning cruise.</p>',
            status: 'done',
          },
          {
            id: 'T-ACT-02',
            status: 'done',
            title: 'Bungee jumping',
            dates: { dateTime: '2024-11-20T13:00:00.000Z' },
            labels: [{ color: '#ae2e24', title: '', colorName: 'red' }],
            description: '<p>Kawarau Bridge.</p>',
            checklists: [
              {
                id: 'CL-ACT-1',
                name: 'Before jump',
                items: [
                  { text: 'Medical form', isChecked: true },
                  { text: 'GoPro rental', isChecked: false },
                ],
              },
            ],
          },
          {
            id: 'T-ACT-03',
            title: 'Hiking Roys Peak',
            labels: [{ color: '#216e4e', title: '', colorName: 'green' }],
            description: '<p>Start early.</p>',
          },
          {
            id: 'T-ACT-04',
            title: 'Maori cultural evening',
            dates: { dateTime: '2024-12-05T18:00:00.000Z' },
            labels: [{ color: '#803fa5', title: '', colorName: 'purple' }],
            description: '<p>Dinner included.</p>',
            comments: [
              {
                id: 'C-ACT-1',
                text: '<p>Highly recommended by locals.</p>',
                createdAt: 1766308746000,
              },
            ],
          },
          {
            id: 'T-ACT-05',
            title: 'Hot springs',
            labels: [{ color: '#9e4c00', title: '', colorName: 'orange' }],
            description: '<p>Evening slot.</p>',
          },
          {
            id: 'T-FD-04',
            title: 'Wine tasting',
            dates: { dateTime: '2024-12-18T14:00:00.000Z' },
            labels: [{ color: '#803fa5', title: '', colorName: 'purple' }],
            description: '<p>Central Otago.</p>',
          },
          {
            id: 'T-FD-05',
            title: 'Food markets',
            labels: [{ color: '#216e4e', title: '', colorName: 'green' }],
            description: '<p>Weekend market.</p>',
            checklists: [
              {
                id: 'CL-FD-1',
                name: 'Try list',
                items: [
                  { text: 'Local cheese', isChecked: false },
                  { text: 'Street desserts', isChecked: false },
                ],
              },
            ],
          },
        ],
      },

      {
        id: 'G-NZ-05',
        title: 'Food & Cafés',
        archivedAt: null,
        tasks: [
          {
            id: 'T-FD-01',
            status: 'done',
            title: 'Try lamb roast',
            dates: { dateTime: '2024-11-12T19:00:00.000Z' },
            labels: [{ color: '#9e4c00', title: '', colorName: 'orange' }],
            description: '<p>Local place.</p>',
          },
          {
            id: 'T-FD-02',
            title: 'Flat white tour',
            labels: [{ color: '#7f5f01', title: '', colorName: 'yellow' }],
            description: '<p>Best cafés.</p>',
            status: 'done',
          },
          {
            id: 'T-FD-03',
            title: 'Fish & chips',
            labels: [{ color: '#1558bc', title: '', colorName: 'blue' }],
            description: '<p>By the lake.</p>',
            comments: [
              {
                id: 'C-FD-1',
                text: '<p>Must try in Queenstown.</p>',
                createdAt: 1766308747000,
              },
            ],
          },
        ],
      },

      {
        id: 'G-NZ-06',
        title: 'To Pack',
        archivedAt: null,
        tasks: [
          {
            id: 'T-PK-01',
            title: 'Hiking gear',
            labels: [{ color: '#216e4e', title: '', colorName: 'green' }],
            description: '<p>Shoes and backpack.</p>',
            status: 'done',
          },
          {
            id: 'T-PK-02',
            status: 'done',
            title: 'Rain jacket',
            dates: { dateTime: '2024-12-07T20:00:00.000Z' },
            labels: [{ color: '#1558bc', title: '', colorName: 'blue' }],
            description: '<p>Waterproof.</p>',
          },
          {
            id: 'T-PK-03',
            title: 'Travel documents',
            labels: [{ color: '#ae2e24', title: '', colorName: 'red' }],
            description: '<p>Passport & insurance.</p>',
            checklists: [
              {
                id: 'CL-PK-1',
                name: 'Documents',
                items: [
                  { text: 'Passport valid', isChecked: true },
                  { text: 'Insurance printed', isChecked: true },
                ],
              },
            ],
          },
          {
            id: 'T-PK-04',
            status: 'done',
            title: 'Power adapters',
            dates: { dateTime: '2024-12-08T21:00:00.000Z' },
            labels: [{ color: '#7f5f01', title: '', colorName: 'yellow' }],
            description: '<p>Type I.</p>',
          },
          {
            id: 'T-PK-05',
            title: 'First aid kit',
            labels: [{ color: '#9e4c00', title: '', colorName: 'orange' }],
            description: '<p>Blister plasters.</p>',
          },
          {
            id: 'T-AD-03',
            title: 'Currency exchange',
            labels: [{ color: '#216e4e', title: '', colorName: 'green' }],
            description: '<p>Mainly card usage.</p>',
          },
          {
            id: 'T-AD-04',
            title: 'Notify bank',
            dates: { dateTime: '2024-11-04T16:00:00.000Z' },
            labels: [{ color: '#803fa5', title: '', colorName: 'purple' }],
            description: '<p>Avoid blocks.</p>',
            comments: [
              {
                id: 'C-AD-1',
                text: '<p>Bank notified via app.</p>',
                createdAt: 1766308748000,
              },
            ],
          },
          {
            id: 'T-AD-05',
            title: 'Emergency contacts',
            labels: [{ color: '#1558bc', title: '', colorName: 'blue' }],
            description: '<p>Saved offline.</p>',
          },
        ],
      },

      {
        id: 'G-NZ-07',
        title: 'Admin & Money',
        archivedAt: null,
        tasks: [
          {
            id: 'T-AD-01',
            title: 'Travel insurance',
            labels: [{ color: '#ae2e24', title: '', colorName: 'red' }],
            description: '<p>Extreme sports covered.</p>',
            status: 'done',
          },
          {
            id: 'T-AD-02',
            status: 'done',
            title: 'NZ ETA visa',
            dates: { dateTime: '2024-11-02T10:00:00.000Z' },
            labels: [{ color: '#7f5f01', title: '', colorName: 'yellow' }],
            description: '<p>Apply online.</p>',
          },
        ],
      },
    ],
    activities: [
      {
        id: 'a101',
        title: 'Changed Color',
        createdAt: 154514,
        byMember: {
          _id: 'u102',
          fullname: 'Ran Hirshorn',
          imgUrl: 'http://some-img',
        },
        group: {
          id: 'D2Y0Ys',
          title: 'Flights',
        },
        task: {
          id: '94WTmg',
          title: 'Tel Aviv to Thailand',
        },
      },
    ],
  }
}
