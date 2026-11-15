
    import React, {Component} from 'react';
    import './DatabaseDemo.css';

    const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || '/api').replace(/\/$/, '');
    const TRANSACTION_URL = `${API_BASE_URL}/transaction`;

    class DatabaseDemo extends Component {
     
        constructor(props) {
            super(props) //since we are extending class Table so we have to use super in order to override Component class constructor
            this.handleTextChange = this.handleTextChange.bind(this);
            this.handleButtonClick = this.handleButtonClick.bind(this);
            this.handleButtonClickDel = this.handleButtonClickDel.bind(this);
            this.state = { 
               transactions: [],
               text_amt: "",
               text_desc:""
            }
         }

         componentDidMount() {
            this.populateData();
          }

        populateData(){
            this.fetch_retry(TRANSACTION_URL,3)
            .then(res => res.json())
            .then((data) => {
              this.setState({ transactions : data.result });
              console.log("state set");
              console.log(this.state.transactions);
            })
            .catch(console.log);
        }  

        async fetch_retry(url, n){
            try {
                return await fetch(url)
            } catch(err) {
                if (n === 1) throw err;
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                return await this.fetch_retry(url, n - 1);
            }
        };


          renderTableData() {
              if (this.state.transactions.length === 0) {
                 return (
                    <tr>
                       <td className="empty-state" colSpan="3">No records yet. Add a transaction to get started.</td>
                    </tr>
                 )
              }

              return this.state.transactions.map((transaction) => {
                 const { id, amount, description} = transaction //destructuring
                 return (
                    <tr key={id}>
                       <td className="record-id">#{id}</td>
                       <td>{amount}</td>
                       <td>{description}</td>
                    </tr>
               )
            })
         }

        handleButtonClickDel(){
           const requestOptions = {
               method: 'DELETE'
           }
           fetch(TRANSACTION_URL, requestOptions)
           .then(response => response.json())
           .then(data => this.populateData())

           this.setState({text_amt : "", text_desc:"",transaction:[]});

        }

         handleButtonClick(){
             console.log(this.state.text_amt);
             console.log(this.state.text_desc);
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({"amount":this.state.text_amt, "desc" :this.state.text_desc})
            }
            
            fetch(TRANSACTION_URL, requestOptions)
            .then(response => response.json())
            .then(data => this.populateData())
            
            this.setState({text_amt : "", text_desc:""});

         }

         handleTextChange(e){
            this.setState({[e.target.name]:e.target.value})
         }


        render () {
        return (
           <section className="database-page" aria-labelledby="database-title">
              <div className="database-heading">
                 <div>
                    <p className="page-eyebrow">Live data · Aurora</p>
                    <h1 id="database-title">Database explorer</h1>
                    <p>Manage transaction records in your application database.</p>
                 </div>
                 <div className="database-count">
                    <strong>{this.state.transactions.length}</strong> records
                 </div>
              </div>

              <div className="database-panel">
                 <div className="entry-form">
                    <label className="field-group">
                       Amount
                       <input
                          type="text"
                          inputMode="decimal"
                          name="text_amt"
                          value={this.state.text_amt}
                          onChange={this.handleTextChange}
                          placeholder="e.g. 125.00"
                       />
                    </label>
                    <label className="field-group">
                       Description
                       <input
                          type="text"
                          name="text_desc"
                          value={this.state.text_desc}
                          onChange={this.handleTextChange}
                          placeholder="What is this transaction for?"
                       />
                    </label>
                    <button type="button" onClick={this.handleButtonClick}>
                       <span aria-hidden="true">＋</span> Add transaction
                    </button>
                 </div>

                 <div className="records-toolbar">
                    <div>
                       <strong>Transactions</strong>
                       <span>Stored records</span>
                    </div>
                    <button className="clear-button" type="button" onClick={this.handleButtonClickDel}>
                       Clear all
                    </button>
                 </div>

                 <div className="table-scroll">
                    <table className="transactions-table">
                       <thead>
                          <tr>
                             <th scope="col">ID</th>
                             <th scope="col">Amount</th>
                             <th scope="col">Description</th>
                          </tr>
                       </thead>
                       <tbody>{this.renderTableData()}</tbody>
                    </table>
                 </div>
              </div>
           </section>

        );
      }
    }

    export default DatabaseDemo;