import React, { createContext, useContext, useReducer } from "react";

const TradesContext = createContext();

export const useTradesContext = () => {
  const context = useContext(TradesContext);
  if (!context) {
    throw new Error("useTradesContext must be used within a TradesProvider");
  }
  return context;
};

export const TRADES_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_TRADES: "SET_TRADES",
  ADD_TRADE: "ADD_TRADE",
  UPDATE_TRADE: "UPDATE_TRADE",
  DELETE_TRADE: "DELETE_TRADE",
  CLEAR_ERROR: "CLEAR_ERROR",
};

const tradesReducer = (state, action) => {
  switch (action.type) {
    case TRADES_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case TRADES_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case TRADES_ACTIONS.SET_TRADES:
      return { ...state, trades: action.payload, loading: false, error: null };
    case TRADES_ACTIONS.ADD_TRADE:
      return {
        ...state,
        trades: [...state.trades, action.payload],
        loading: false,
        error: null,
      };
    case TRADES_ACTIONS.UPDATE_TRADE:
      return {
        ...state,
        trades: state.trades.map((trade) =>
          trade.id === action.payload.id ? action.payload : trade
        ),
        loading: false,
        error: null,
      };
    case TRADES_ACTIONS.DELETE_TRADE:
      return {
        ...state,
        trades: state.trades.filter((trade) => trade.id !== action.payload),
        loading: false,
        error: null,
      };
    case TRADES_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  trades: [],
  loading: false,
  error: null,
};

export const TradesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(tradesReducer, initialState);

  const value = {
    state,
    dispatch,
  };

  return (
    <TradesContext.Provider value={value}>{children}</TradesContext.Provider>
  );
};