import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Jane',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -15,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 10,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Display/hide form
  const handleShowAddFriend = () => {
    // Toggle to display/close friend form
    setShowAddFriend(show => !show);
  };

  // Add friend
  const handleAddFriend = friend => {
    // add friend to list
    setFriends(friends => [...friends, friend]);

    // close friend form
    setShowAddFriend(false);
  };

  // Display splitBill form on selecting a friend
  const handleSelectedFriend = friend => {
    // setSelectedFriend(friend);
    setSelectedFriend(selectedFriend =>
      selectedFriend?.id === friend.id ? null : friend
    );

    // close friend form
    setShowAddFriend(false);
  };

  // Split bill
  const handleSplitBill = amount => {
    console.log(amount);
    // update friend object
    setFriends(friends =>
      friends.map(friend =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + amount }
          : friend
      )
    );

    // close split form
    setSelectedFriend(null);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? 'Close' : 'Add friend'}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
            key={selectedFriend.id}
        />
      )}
    </div>
  );
}

export default App;

function FriendsList({ friends, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map(friend => (
        <Friend
          friend={friend}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
          key={friend.id}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
  // identify the selected friend
  const isSelectedFriend = selectedFriend?.id === friend.id;

  return (
    <li className={isSelectedFriend ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />

      <h3>{friend.name}</h3>

      {friend.balance < 0 ? (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      ) : friend.balance === 0 ? (
        <p>You and {friend.name} are even</p>
      ) : (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}
        </p>
      )}

      <Button
        onClick={() => {
          onSelectFriend(friend);
        }}
      >
        {isSelectedFriend ? 'Close' : 'Select'}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  // submit data
  const handleSubmit = e => {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newfriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    // add friend
    onAddFriend(newfriend);

    // return to default state
    setName('');
    setImage('https://i.pravatar.cc/48');
  };

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👨🏿‍🤝‍👨🏿 Friend name</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />

      <label>🖼 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={e => setImage(e.target.value)}
      />

      <button className="button">Add</button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState('');
  const [expenseByUser, setExpenseByUser] = useState('');
  const expenseByFriend = bill - expenseByUser;
  const [payer, setPayer] = useState('user');

  const handleSubmit = e => {
    e.preventDefault();

    if (!bill || !expenseByUser) return;

    // split bill
    onSplitBill(payer === 'user' ? expenseByFriend : -expenseByUser);
  };

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💸 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={e => setBill(+e.target.value)}
      />

      <label>🙋‍♂️ Your expense</label>
      <input
        type="text"
        value={expenseByUser}
        onChange={e =>
          setExpenseByUser(
            +e.target.value > bill ? expenseByUser : +e.target.value
          )
        }
      />

      <label>🙋 {selectedFriend.name}'s expense</label>
      <input type="text" value={expenseByFriend} disabled />

      <label>💳who pays the bill?</label>
      <select value={payer} onChange={e => setPayer(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      {/* <button className="button">Split bill</button> */}
      <Button>Split Bill</Button>
    </form>
  );
}
