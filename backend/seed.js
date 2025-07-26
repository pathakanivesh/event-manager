const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://anivesh1024pathak:Anivesh%40123@cluster0.xptm7pr.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  images: [{ type: String }], // ✅ Added images array
});

const Event = mongoose.model('Event', eventSchema);

const sampleEvents = [
  {
    title: 'Music Concert',
    date: new Date('2025-06-20'),
    location: 'New York',
    description: 'Enjoy a night of amazing music performances.',
    price: 499,
    images: [
      'https://5.imimg.com/data5/DB/WJ/MY-605509/music-concert.jpg',
      'https://etimg.etb2bimg.com/photo/117027393.cms',
      'https://applications-media.feverup.com/image/upload/f_auto/fever2/filter/photo/41fd2970-0eb9-11ef-be76-d6e48d311834.png',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtVTF-3TU3LOPdM03_oEvqXPi2hH4EW0tfRg&s'
    ]
  },
  {
    title: 'Art Exhibition',
    date: new Date('2025-07-05'),
    location: 'San Francisco',
    description: 'Explore modern art from upcoming artists.',
    price: 499,
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIYN9eMsd0m8wl4InLHBXwgk3OPm2CzO7dGA&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTG9JeCYAmqwEPniSoXYjgZ92hj3EuCWY8rCQ&s'
    ]
  },
  {
    title: 'Tech Conference',
    date: new Date('2025-08-10'),
    location: 'Los Angeles',
    description: 'Join industry experts to discuss the future of technology.',
    price: 499,
    images: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsbP1SjH7EkE1TXIwAcnjd0wZOTem0iIlysA&s',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN7l9zkgdKNFaMj22gQFD9DSjM7vXl4hGyoQ&s'
    ]
  },
];

async function seedDB() {
  try {
    await Event.deleteMany({});
    await Event.insertMany(sampleEvents);
    console.log('✅ Database seeded successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    mongoose.connection.close();
  }
}

seedDB();
