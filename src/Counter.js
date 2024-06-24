import React from "react";

// render method - every single React component written with classes needs to include 'render' method
// 'render' is equivalent to function body of a function component
// 'render' returns some JSX
// states work differently in class components
class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = { count: 1 };
    // manually bind 'this' keyword with the function. By doing this, we give this method (handleDecrease) access to the current component instance
    this.handleDecrease = this.handleDecrease.bind(this);

    // this.handleIncrease = this.handleIncrease.bind(this);
  }

  handleDecrease() {
    // updating the state by 'setState'
    this.setState((currCount) => {
      // return a new object where the 'count' property will be updated
      return { count: currCount.count - 1 };
    });
  }

  // great advantage of arrow function, is that they don't loose their binding to 'this'. They get access to the surrounding 'this'. So, we don't have to manually bind in the 'constructor'.
  handleIncrease = () => {
    this.setState((currCount) => {
      return { count: currCount.count + 1 };
    });
  };

  // this 'render' method must be as clean as possible, means little render logic. However, a very simple logic is allowed to implement
  render() {
    const date = new Date("june 27 2027");
    date.setDate(date.getDate() + this.state.count);

    return (
      <>
        <div>
          <button onClick={this.handleDecrease}>-</button>
          <span>
            {date.toDateString()} [{this.state.count}]
          </span>
          <button onClick={this.handleIncrease}>+</button>
        </div>
      </>
    );
  }
}

export default Counter;
