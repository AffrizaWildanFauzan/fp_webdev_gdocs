import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalculator, FaMoneyBillWave, FaCalendarAlt, FaPercent } from 'react-icons/fa';
import { formatPrice } from '../utils/helpers';

const MortgageCalculator = ({ propertyPrice }) => {
  const [price, setPrice] = useState(propertyPrice || 500000000);
  const [downPayment, setDownPayment] = useState(20);
  const [downPaymentType, setDownPaymentType] = useState('percent');
  const [loanTerm, setLoanTerm] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [result, setResult] = useState(null);

  useEffect(() => {
    calculateMortgage();
  }, [price, downPayment, downPaymentType, loanTerm, interestRate]);

  const calculateMortgage = () => {
    const downPaymentAmount = downPaymentType === 'percent'
      ? (price * downPayment / 100)
      : downPayment;

    const loanAmount = price - downPaymentAmount;
    const monthlyInterestRate = (interestRate / 100) / 12;
    const numberOfPayments = loanTerm * 12;

    let monthlyPayment = 0;
    if (monthlyInterestRate > 0) {
      monthlyPayment = loanAmount * (
        monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)
      ) / (
        Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1
      );
    } else {
      monthlyPayment = loanAmount / numberOfPayments;
    }

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest,
      loanAmount,
      downPaymentAmount,
    });
  };

  return (
    <div className="card-shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <FaCalculator className="text-primary-500 text-xl" />
        <h3 className="font-heading text-xl font-bold">Simulasi KPR</h3>
      </div>

      <div className="space-y-4">
        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Harga Properti
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Uang Muka (DP)
          </label>
          <div className="flex gap-2">
            <select
              value={downPaymentType}
              onChange={(e) => setDownPaymentType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
            >
              <option value="percent">%</option>
              <option value="nominal">Rp</option>
            </select>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Jangka Waktu (Tahun)
          </label>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400" />
            <input
              type="range"
              min="1"
              max="30"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="flex-1"
            />
            <span className="font-semibold min-w-[60px]">{loanTerm} th</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Suku Bunga (%)
          </label>
          <div className="flex items-center gap-2">
            <FaPercent className="text-gray-400" />
            <input
              type="range"
              min="1"
              max="15"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="flex-1"
            />
            <span className="font-semibold min-w-[60px]">{interestRate}%</span>
          </div>
        </div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg space-y-2"
          >
            <div className="flex justify-between items-center border-b border-primary-200 dark:border-primary-800 pb-2">
              <span className="text-sm font-medium">Cicilan per Bulan</span>
              <span className="text-2xl font-bold text-primary-500">
                {formatPrice(result.monthlyPayment)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">DP</span>
                <p className="font-semibold">{formatPrice(result.downPaymentAmount)}</p>
              </div>
              <div>
                <span className="text-gray-500">Total Pembayaran</span>
                <p className="font-semibold">{formatPrice(result.totalPayment)}</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Total Bunga</span>
                <p className="font-semibold text-red-500">{formatPrice(result.totalInterest)}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MortgageCalculator;