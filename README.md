# Frontend Assignment Solutions By Simran Das - Steeleye
#### 1. Explain what the simple `List` component does.

#### Ans - The simple `List` component does the following tasks --

##### I) The `WrappedListComponent` returns each `SingleListItem` by reading from an ordered `items` array in an unordered list format. The `WrappedListComponent` passes the `onClickHandler` down as props to `SingleListItem` component. The `WrappedListComponent` maintains a state of selection for `SingleListItem` as it passes the `isSelected` down as props. The `WrappedListComponent` passes `key` as `index` to `SingleListItem` in order to maintain the individuality of the component for React.


##### II) The `WrappedListComponent` uses inline style to align the text to the left side of all the child components inside the `unordered list (ul)` element.


##### III) `WrappedListComponent` uses 2 React Hooks --

      (a) useState - useState can only be used inside a functional component. It returns the state variable and setState 
                     method as an array.
      (b) useEffect - To deal with "side effects" in React functional components, useEffect Hook can be used when component 
                      mounts or/and with each update or/and before component unmounts.
          In our case, we have used "useEffect" to update the state only when "items" prop updates.
                

##### IV) The `SingleListItem` receives the `onClickHandler` which has a handleClick function with the ability to change the background color of the list item being clicked based on the index of that particular list item. `SingleListItem` component uses inline styling and using ternary operator to decide the respective background color. If `isSelected` is `true`, then the background color will be `green`, otherwise `red`.


##### V) The `SingleListItem` is a memoed version of `WrappedSingleListItem`. `React.memo` only checks for prop changes and renders accordingly. If no prop changes, then the `React.memo` will skip the re-rendering of the component. The `React.memo` helps improve the performance optimisation of the application.

---

#### 2. What problems / warnings are there with code?

#### Ans - The problems / warnings which were found in thr code are mentioned below:

#### (a) `Logic Error: In the usage of onClickHandler`

##### Through a function call, a function will only be called once the component renders, hence only rendering green color for the list item which was initially clicked despite of page reload.

##### To remove this anomaly, we should pass the function reference to onClick prop i.e, an arrow function so that it can be called later by React, once the click actually happens.

#### WRONG CODE --

    const WrappedSingleListItem = ({ index, isSelected, onClickHandler, text }) => {
        return (
          <li
            style={{ backgroundColor: isSelected ? "green" : "red" }}
            onClick={onClickHandler(index)}
          >
            {text}
          </li>
        );
     };    
        
#### CORRECTED CODE --

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

#### (b) `Syntax Error: In the usage of useState Hook of React`

##### The `useState` Hook takes into account initial state as an argument and returns an array of two entries.

##### Thus, `Correct Syntax` should have its first element as the initial state and the second one as a function that is used for updating the state. Also setting the initial value as `null`.

#### WRONG CODE --

     const [setSelectedIndex, selectedIndex] = useState();

#### CORRECTED CODE --

     const [selectedIndex, setSelectedIndex] = useState(null);

#### (c) `Warning: Missing unique key for each list item`

##### Every list item requires an unique key.

##### So, initialised an unique key for each list item with the index value of that particular list item

#### MISSING UNIQUE KEY --

     return (
        <ul style={{ textAlign: 'left' }}>
            {items.map((item, index) => (
                  <SingleListItem
                   onClickHandler={() => handleClick(index)}
                   text={item.text}
                   index={index}
                   isSelected={selectedIndex}
                  />
            ))}
        </ul>
    );

#### ADDED UNIQUE KEY --

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

#### (d) `Warning: Failed prop type: Invalid prop "isSelected" of type "number" supplied to "WrappedSingleListItem", expected "boolean"`

##### Here `isSelected` will only take a boolean value. So,if we pass boolean values as props, that value gets converted to a string or number, causing failed prop type.

##### To fix this, we need to first convert that string or number to a boolean value before implementing.

#### WRONG CODE --

     return (
           <ul style={{ textAlign: "left" }}>
                 {items.map((item, index) => (
                       <SingleListItem
                        onClickHandler={() => handleClick(index)}
                        text={item.text}
                        index={index}
                        isSelected={selectedIndex} 
                       />
                  ))}
            </ul>
      );

#### CORRECTED CODE --

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

#### (e) `Syntax Error: Wrong usage of PropTypes validators`

##### PropTypes exports a range of validators that can be used to make sure that the data we receive is valid.

##### -- To denote an array of certain type, `arrayOf` validator should be used instead of `array`

##### -- There is no shapeOf validator available. The correct validator is `shape`

#### WRONG CODE --

     WrappedListComponent.propTypes = {
         items: PropTypes.array(PropTypes.shapeOf({
             text: PropTypes.string.isRequired,
         })),
     };

#### CORRECTED CODE --

     WrappedListComponent.propTypes = {
         items: PropTypes.arrayOf(PropTypes.shape({
            text: PropTypes.string.isRequired,
         })),
     };


#### (f) `Uncaught TypeError: Cannot read properties of null (reading 'map')`

##### In the given code, the `items` array was initialised as `null`, and it is not possible to map over null. Thus, we need to initialize it with some value so that mapping over the list items of the items array can be performed.

#### WRONG CODE --

     WrappedListComponent.defaultProps = {
         items: null,
     };

#### CORRECTED CODE --

     WrappedListComponent.defaultProps = {
         items: [
             { text: "Sample List Item", index: 1 },
             { text: "Sample List Item", index: 2 },
             { text: "Sample List Item", index: 3 },
             { text: "Sample List Item", index: 4 },
             { text: "Sample List Item", index: 5 },
         ],
     };

#### (g) `Unrequired usage of memo on "WrappedListComponent" when assigning the List variable`

##### React `memo` function prevents re-renders on the component when a parent changes, but the props to the child component do not change.

##### But, the `memo` on `WrappedListComponent` will not make any difference since the only props it is receiving is the `items` array. Hence, we can safely avoid using memo as it does not prevent re-rendering because if one item is clicked, not only that particular item re-renders and changes its background color from red to green, but also the entire `items` array re-renders.

#### GIVEN CODE --

     const List = memo(WrappedListComponent);

#### MODIFIED CODE --

     const List = WrappedListComponent;

---

#### 3. Please fix, optimize, and/or modify the component as much as you think is necessary.

#### Ans - The fixed code is demonstrated below --

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

      //Replacing array with arrayOf and shapeOf with shape
      //arrayOf and shape are correct validators of PropTypes
      WrappedListComponent.propTypes = {
        items: PropTypes.array(
          PropTypes.shapeOf({
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

      //avoided using memo as it does not prevent re-rendering
      //as only a single prop i.e, 'items' array is received in it
      const List = WrappedListComponent;

      export default List;


---
