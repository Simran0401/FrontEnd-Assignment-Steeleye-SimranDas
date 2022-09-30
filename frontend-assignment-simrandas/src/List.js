import React, { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";

// Single List Item
const WrappedSingleListItem = ({ index, isSelected, onClickHandler, text }) => {
  return (
    <li
      style={{ backgroundColor: isSelected ? "green" : "red" }}
      //Should pass the function reference to onClick prop instead of function call
      onClick={() => onClickHandler(index)}
    >
      {text}
    </li>
  );
};

WrappedSingleListItem.propTypes = {
  index: PropTypes.number,
  isSelected: PropTypes.bool,
  onClickHandler: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

const SingleListItem = memo(WrappedSingleListItem);

// List Component
const WrappedListComponent = ({ items }) => {
  //Corrected the syntax of useState hook by updating it in correct sequence,
  //i.e, the first element is the current state, and the next element is the function that updates it
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    setSelectedIndex(null);
  }, [items]);

  const handleClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <ul style={{ textAlign: "left" }}>
      {items.map((item, index) => (
        <SingleListItem
          key={index} //Adding an unique key to each list item
          onClickHandler={() => handleClick(index)}
          text={item.text}
          index={index}
          isSelected={selectedIndex === index} //Returning a boolean value based on whether that list item is clicked
        />
      ))}
    </ul>
  );
};

//Replacing array with arrayOf, as arrayOf denotes an array of certain type
//and shapeOf with shape, as no shapeOf valdator exists for PropTypes
WrappedListComponent.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
    })
  ),
};

//Replacing the items array with 5 sample values instead of null
//as mapping over null is not possible
WrappedListComponent.defaultProps = {
  items: [
    { text: "Sample List Item", index: 1 },
    { text: "Sample List Item", index: 2 },
    { text: "Sample List Item", index: 3 },
    { text: "Sample List Item", index: 4 },
    { text: "Sample List Item", index: 5 },
  ],
};

//Avoided using memo as it does not prevent re-rendering
//as only a single prop i.e, 'items' array is received in it
const List = WrappedListComponent;

export default List;
