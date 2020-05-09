import React, { Component } from 'react';
import moment from 'moment';
import Table from 'react-bootstrap/Table';
import { authHeader, handleResponse } from '@/_helpers';
import { userService, authenticationService } from '@/_services';

class OppilasRaportti extends Component {

    constructor(props) {
        super(props);
        console.log("Opettaja-komponentti: constructor");
        this.state = { 
            tunnit: [], 
            start: 0,
            take: 10,
            visible: "table",
            currentUser: authenticationService.currentUserValue    
        }; 
      }
    
      handleClickTable = () => {
        this.setState({visible: "table"})
      }
     
      handleClickPrev = () => {
        let startvalue = this.state.start;
        if (startvalue > 0) {
            startvalue = startvalue-10;
        }
        this.setState({start: startvalue},this.handleSubmit);
      }
    
      handleClickNext = () => {
        this.setState({start: this.state.start+10},this.handleSubmit);
      }
    
      handleSubmit() {
        console.log('HaeNWRestApista: . . . . handleSubmitissa');
        this.HaeNWRestApista();
      }
    
      HaeNWRestApista() {
        this.opettajaGetAll().then(tunnit => this.setState({ tunnit }));
      }
    
    opettajaGetAll() {   
      const uri = 'http://localhost:4000/api/opettaja/r?offset='+this.state.start+'&limit='+this.state.take;
      // const uri = 'http://localhost:4000/api/oppilas/';
      const requestOptions = { method: 'GET', headers: authHeader() };
      return fetch(uri, requestOptions).then(handleResponse);
    } 

      componentDidMount() {
        this.opettajaGetAll().then(tunnit => this.setState({ tunnit }));  
        const { currentUser } = this.state;
        userService.getById(currentUser.id);    
      }

      render() {
        const { tunnit } = this.state;
        const { currentUser} = this.state;
        console.log('Render', tunnit);
        //Ehdollinen return
        if (this.state.visible==="table") {
          return (     
          <div className="raportimg">
            <h1 className="text-center">Tuntiraportti</h1>                   
                        {tunnit && currentUser &&
                        <Table responsive="md">                     
                          <thead><tr><th>Oppilas</th><th>luokkahuone</th><th>Sisään</th><th>Ulos</th></tr></thead>
                            <tbody>                                                      
                            {tunnit.filter(tunti => tunti.userId === currentUser.id).map(tunti =>                         
                                  <tr key={tunti.tunnitId}> 
                                    <td>{tunti.tunnitId}</td>                                                         
                                  <td>{tunti.oppilasName}</td>
                                 <td>{tunti.luokkahuoneNimi}</td>                                   
                                 <td>{moment(new Date(tunti.sisaan)).format("DD.MM.YYYY hh:mm:ss")}</td>
                                 <td>{moment(new Date(tunti.ulos)).format("DD.MM.YYYY hh:mm:ss")}</td>                                                
                             </tr>)}
                            </tbody>
                        </Table>
                        }  
                <button  onClick={this.handleClickPrev}><i className="fas fa-angle-double-left"> Edelliset</i></button>
                <button  onClick={this.handleClickNext}>Seuraavat <i className="fas fa-angle-double-right"></i></button>
          </div>
        );
        } else {
          return (<div className="box1">
            <h1>Sovellusvirhe - lataa sivu uudelleen!</h1>
          </div>
          );
        }  
      }
    }
export default OppilasRaportti;