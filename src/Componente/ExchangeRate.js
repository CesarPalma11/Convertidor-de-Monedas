// src/ExchangeRate.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ExchangeRate.css';
import country_list from './country-list';
import { FaExchangeAlt } from 'react-icons/fa';

const ExchangeRate = () => {
  const [rates, setRates] = useState({});
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("NPR");
  const [amount, setAmount] = useState(1);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/c99a8d6bbd8cced02b5730ca/latest/${fromCurrency}`);
        setRates(response.data.conversion_rates);
        setExchangeRate(response.data.conversion_rates[toCurrency]);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchRates();
  }, [fromCurrency, toCurrency]);

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleExchangeRate = () => {
    if (rates[toCurrency]) {
      setExchangeRate(rates[toCurrency]);
    }
  };

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setAmount((amount * exchangeRate).toFixed(2));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleExchangeRate();
  };

  return (
    <div className="wrapper">
      <header>Cambio de moneda</header>
      <form onSubmit={handleSubmit}>
        <div className="amount">
          <p>Ingresa el monto</p>
          <input type="text" value={amount} onChange={handleAmountChange} />
        </div>
        <div className="drop-list">
          <div className="from">
            <p>Cantidad</p>
            <div className="select-box">
              <img src={`https://flagcdn.com/48x36/${country_list[fromCurrency].toLowerCase()}.png`} alt="flag" />
              <select value={fromCurrency} onChange={handleFromCurrencyChange}>
                {Object.keys(country_list).map(currency_code => (
                  <option value={currency_code} key={currency_code}>
                    {currency_code}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="icon" onClick={handleSwap}>
            <FaExchangeAlt />
          </div>
          <div className="to">
            <p>Convertido a</p>
            <div className="select-box">
              <img src={`https://flagcdn.com/48x36/${country_list[toCurrency].toLowerCase()}.png`} alt="flag" />
              <select value={toCurrency} onChange={handleToCurrencyChange}>
                {Object.keys(country_list).map(currency_code => (
                  <option value={currency_code} key={currency_code}>
                    {currency_code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="exchange-rate">
          {loading ? "Realizando cambio..." : `${amount} ${fromCurrency} = ${(amount * exchangeRate).toFixed(2)} ${toCurrency}`}
        </div>
        <button type="submit">Actualizar Cambio</button>
        {error && <div className="error">Algo salio mal  : {error.message}</div>}
      </form>
    </div>
  );
};

export default ExchangeRate;
