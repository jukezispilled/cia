import React, { useState, useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { Radar, Crosshair, Shield, Zap, Radio, Target, Map, Fingerprint, User, Bitcoin, TrendingUp, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

const TradingSimulator = () => {
    const [price, setPrice] = useState(150);
    const [priceHistory, setPriceHistory] = useState([{
        time: Math.floor(Date.now() / 1000),
        open: 150,
        high: 150,
        low: 150,
        close: 150,
    }]);
    const chartContainerRef = useRef();
    const chartRef = useRef();
    const buyIntervalRef = useRef(null);
  
    useEffect(() => {
        if (chartContainerRef.current) {
            const chart = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: chartContainerRef.current.clientHeight,
                layout: {
                    backgroundColor: '#ffffff',
                    textColor: '#000000',
                },
                grid: {
                    vertLines: {
                        color: '#e1e1e1',
                    },
                    horzLines: {
                        color: '#e1e1e1',
                    },
                },
                priceScale: {
                    borderColor: '#cccccc',
                },
                timeScale: {
                    borderColor: '#cccccc',
                },
            });

            const candlestickSeries = chart.addCandlestickSeries({
                upColor: '#4caf50',
                downColor: '#f44336',
                borderDownColor: '#f44336',
                borderUpColor: '#4caf50',
                wickDownColor: '#f44336',
                wickUpColor: '#4caf50',
            });

            chartRef.current = candlestickSeries;

            return () => chart.remove();
        }
    }, []);

    useEffect(() => {
        if (chartRef.current) {
            const sortedHistory = [...priceHistory].sort((a, b) => a.time - b.time);
            chartRef.current.setData(sortedHistory);
        }
    }, [priceHistory]);

    useEffect(() => {
        const interval = setInterval(() => {
            setPrice(prevPrice => {
                const change = (Math.random() - 0.5) * 2;
                const newPrice = Math.max(0, prevPrice + change);
                const lastEntry = priceHistory[priceHistory.length - 1];
                const newTime = lastEntry.time + 60; // Increment time by 60 seconds
                const newEntry = {
                    time: newTime,
                    open: lastEntry.close,
                    high: Math.max(lastEntry.close, newPrice),
                    low: Math.min(lastEntry.close, newPrice),
                    close: newPrice,
                };
                setPriceHistory(prev => {
                    const updatedHistory = [
                        ...prev.filter(entry => entry.time < newTime),
                        newEntry
                    ].sort((a, b) => a.time - b.time);
                    return updatedHistory;
                });
                return newPrice;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [priceHistory]);

    const handleBuy = () => {
        // Start increasing price continuously
        if (!buyIntervalRef.current) {
            buyIntervalRef.current = setInterval(() => {
                setPrice(prev => {
                    const newPrice = prev * 1.05; // Increase price by 5%
                    const lastEntry = priceHistory[priceHistory.length - 1];
                    const newTime = lastEntry.time + 60; // Increment time by 60 seconds
                    const newEntry = {
                        time: newTime,
                        open: lastEntry.close, // Open price is the last close
                        high: Math.max(lastEntry.close, newPrice),
                        low: Math.min(lastEntry.close, newPrice),
                        close: newPrice,
                    };
                    setPriceHistory(prev => {
                        const updatedHistory = [
                            ...prev.filter(entry => entry.time < newTime),
                            newEntry
                        ].sort((a, b) => a.time - b.time);
                        return updatedHistory;
                    });
                    return newPrice;
                });
            }, 1000); // Adjust the interval time as needed
        }
    };

    const handleSell = () => {
        // Stop the buy interval
        clearInterval(buyIntervalRef.current);
        buyIntervalRef.current = null;

        // Get the current price and create a new price entry representing a red candle
        const lastEntry = priceHistory[priceHistory.length - 1];
        const newTime = lastEntry.time + 60; // Increment time by 60 seconds
        const newEntry = {
            time: newTime,
            open: lastEntry.close, // Open price is the last close
            high: lastEntry.close, // High is the same as the last close
            low: 0, // Low goes to 0
            close: 0, // Close goes to 0
        };
        setPriceHistory(prev => {
            const updatedHistory = [
                ...prev.filter(entry => entry.time < newTime),
                newEntry
            ].sort((a, b) => a.time - b.time);
            return updatedHistory;
        });
        setPrice(0); // Optionally, you can set the price to zero, but this is not necessary for the candle display.
    };

    return (
        <div className="w-full max-w-lg p-4">
            <div className="bg-black p-4 flex flex-col items-center">
                <div className="flex space-x-4 mb-4 font-semibold">
                    <button 
                        onClick={handleBuy} 
                        className="bg-green-500 text-white px-4 py-2 hover:bg-green-600"
                    >
                        UP ONLY
                    </button>
                    <button 
                        onClick={handleSell} 
                        className="bg-red-500 text-white px-4 py-2 hover:bg-red-600"
                    >
                        RUG
                    </button>
                </div>
                <div ref={chartContainerRef} className="w-full h-[170px] md:h-[220px]"></div>
            </div>
        </div>
    );
};

export default function Dash() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prices, setPrices] = useState({
    BTC: { amount: 0, value: 0, change: 0 },
    ETH: { amount: 0, value: 0, change: 0 },
    SOL: { amount: 0, value: 0, change: 0 }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true'
        );
        const data = await response.json();

        setPrices({
          BTC: {
            amount: '1.5431',
            value: data.bitcoin.usd,
            change: data.bitcoin.usd_24h_change.toFixed(2)
          },
          ETH: {
            amount: '13.7652',
            value: data.ethereum.usd,
            change: data.ethereum.usd_24h_change.toFixed(2)
          },
          SOL: {
            amount: '133.8901',
            value: data.solana.usd,
            change: data.solana.usd_24h_change.toFixed(2)
          }
        });
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
      }
    };

    fetchPrices();
    const priceInterval = setInterval(fetchPrices, 60000); // Fetch prices every minute

    return () => clearInterval(priceInterval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8 overflow-hidden relative">

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        <div className="col-span-1 md:col-span-2 lg:col-span-3 border p-4 relative">
            <div className="absolute top-4 right-4 z-10 hidden md:block">
                <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{currentTime.toLocaleTimeString()}</span>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4 flex items-center">
                OPERATION: UP ONLY
            </h2>
            
            <div className="flex md:h-[350px] relative overflow-hidden justify-center items-center">
                <video
                autoPlay
                loop
                muted
                className="absolute top-0 left-0 w-full h-full object-cover"
                src="/vid.mp4"
                />
                <img
                src="/cia.png"
                alt="CIA Logo"
                className="size-44 p-6 md:p-0 md:size-64 animate-spin z-10"
                style={{ animation: 'spin 10s linear infinite' }}
                />
                    <div className='absolute bottom-1 right-1 flex items-center z-[50]'>
                        <a href="https://x.com/CIAtokensol" className='transition ease-in-out duration-150'>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className='size-8 md:size-10 md:hover:scale-105 transition ease-in-out duration-150 cursor-pointer' fill="#FFFFFF" viewBox="0 0 50 50">
                            <path d="M 6.9199219 6 L 21.136719 26.726562 L 6.2285156 44 L 9.40625 44 L 22.544922 28.777344 L 32.986328 44 L 43 44 L 28.123047 22.3125 L 42.203125 6 L 39.027344 6 L 26.716797 20.261719 L 16.933594 6 L 6.9199219 6 z"></path>
                            </svg>
                        </a>
                        <a href="https://t.me/CIAtokenportal" className='transition ease-in-out duration-150'>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className='size-8 md:size-10 md:hover:scale-105 transition ease-in-out duration-150 cursor-pointer' fill="#FFFFFF" viewBox="0 0 50 50">
                            <path d="M46.137,6.552c-0.75-0.636-1.928-0.727-3.146-0.238l-0.002,0C41.708,6.828,6.728,21.832,5.304,22.445	c-0.259,0.09-2.521,0.934-2.288,2.814c0.208,1.695,2.026,2.397,2.248,2.478l8.893,3.045c0.59,1.964,2.765,9.21,3.246,10.758	c0.3,0.965,0.789,2.233,1.646,2.494c0.752,0.29,1.5,0.025,1.984-0.355l5.437-5.043l8.777,6.845l0.209,0.125	c0.596,0.264,1.167,0.396,1.712,0.396c0.421,0,0.825-0.079,1.211-0.237c1.315-0.54,1.841-1.793,1.896-1.935l6.556-34.077	C47.231,7.933,46.675,7.007,46.137,6.552z M22,32l-3,8l-3-10l23-17L22,32z"></path>
                            </svg>
                        </a>
                    </div>
            </div>
        </div>

        <div className="border p-4">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <User className="mr-2" /> Agent Profile
          </h2>
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2">
              <img src="/pfp.png" alt="Agent" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold mb-1">Crypto Internet Autist</h3>
            <p className="mb-1">Codename: CIA</p>
            <p className="mb-4 text-xs">CA: 8AnNSp4hvhdtopzcENLinNpp3pbDsS1Aq4jyyHyXpump</p>
            <div className="w-full">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Mission Readiness</span>
                <span className="text-sm">72%</span>
              </div>
              <div className="w-full bg-blue-200 h-2 rounded">
                <div className="h-full w-[72%] bg-green-500 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <div className='border'>
            <TradingSimulator />
        </div>

        <div className="border p-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Target className="mr-2" /> Messages
            </h2>
            <div className="space-y-2 text-black">
                <div className="bg-gray-100 p-2 rounded-md">
                <strong>agent ansem:</strong> pump is about to commence
                </div>
                <div className="bg-gray-100 p-2 rounded-md">
                <strong>agent mitch:</strong> almost done with RICO case for retardios
                </div>
                <div className="bg-gray-100 p-2 rounded-md">
                <strong>agent zachxbt:</strong> someone just profited from buying and holding. Despicable
                </div>
                <div className="bg-gray-100 p-2 rounded-md">
                <strong>agent yenni:</strong> what's the next cook
                </div>
            </div>
            </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Bitcoin className="mr-2" /> Crypto Portfolio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-black">
            {[
              { name: 'Bitcoin', symbol: 'BTC', amount: prices.BTC.amount, value: `$${prices.BTC.value}`, change: `${prices.BTC.change}%`, color: 'orange' },
              { name: 'Ethereum', symbol: 'ETH', amount: prices.ETH.amount, value: `$${prices.ETH.value}`, change: `${prices.ETH.change}%`, color: 'blue' },
              { name: 'Solana', symbol: 'SOL', amount: prices.SOL.amount, value: `$${prices.SOL.value}`, change: `${prices.SOL.change}%`, color: 'purple' },
              { name: 'Crypto Internet Autists', symbol: 'CIA', amount: '10M', value: '$2,000', change: '+10.0%', color: 'green' },
            ].map((coin) => (
              <div key={coin.symbol} className={`bg-white p-4 border`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-700">{coin.name}</span>
                  <span className={`border-black border p-1 rounded`}>{coin.symbol}</span>
                </div>
                <div className="text-2xl font-bold mb-2">{coin.amount}</div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{coin.value}</span>
                  <span className={`text-${coin.change.startsWith('+') ? 'green' : 'red'}-600 flex items-center`}>
                    {coin.change.startsWith('+') ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                    {coin.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}