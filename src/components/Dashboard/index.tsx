import React, { useContext, useState } from 'react';
import { Button, Col, Form, Row, Spinner } from 'react-bootstrap';
// import * as $ from 'jquery'

import './dashboard.css';
// import "react-datepicker/dist/react-datepicker.css";
import Loader from '../common/Loader';

import BdcStats from './BdcStats/Report';
import LeadGeneratedReport from './LeadGeneratedReport/Report';
import LeadByYear from './LeadsByYear/Report';
import LeadByModelReport from './LeadByModalReport/Report';
import Report from './ROIMatchBackReport/Report';
import { toastify } from '../common/notification';
import { UserContext } from '../common/UserContext';
import axios from 'axios';
import config from '../../config.json';
// import YearPicker from "react-year-picker";

const Dashboard = ({ setUser }: { setUser: Function }) => {
    const { authToken } = useContext(UserContext);
    const [fromDate, setFromDate] = useState<any>("")
    const [loading, setLoading] = useState(false)
    const [toDate, setToDate] = useState<any>("")
    const [data, setData] = useState<any>(null)
    const url = config['baseHost_backend'];
    const handleFromYearChange = (e: any) => {
        console.log('date 1', e.target.value)
        setFromDate(e.target.value)
        setUser((prev: any) => ({ ...prev, fromDate: e.target.value }))
    }
    const handleTOYearChange = (e: any) => {
        console.log('date 2', e.target.value)
        setToDate(e.target.value)
        setUser((prev: any) => ({ ...prev, toDate: e.target.value }))
    }


    const fetchData = () => {
        let dateStr
        dateStr = new Date(fromDate);
        const iso1 = dateStr.toISOString();

        // let dateStr1 = toDate as any
        let dateStr1
        dateStr1 = new Date(toDate);
        const iso2 = dateStr1.toISOString();

        console.log('ISO', iso1, iso2)

        console.log('dsdsjkdhkjsd', fromDate, toDate)

        let bodyData = {
            dateRange: {
                dateFrom: iso1,
                dateto: iso2
            }
        }
        console.log('body', bodyData)
        setLoading(true)
        axios
            .post(`${url}/test-dashboard`, bodyData, {
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
            })
            .then((res) => {
                setData(res.data.body.data)
                // setData(res.data.body.updateArray);
                // setFront(res.data.body.sum.totalFront)
                // setBack(res.data.body.sum.totalBack)
                // seTtotal(res.data.body.sum.total)
                // setROI(res.data.body.sum.totalSalesPrice)
                // setUser((prev: any) => ({ ...prev, soldvalue: res.data?.body?.updateArray.length }))
                console.log('date Post responce', res)
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
                toastify(
                    'failure',
                    error.response.data.message.length > 0
                        ? error.response.data.message
                        : 'Something went wrong'
                )
            }
            );

    }

    return (
        <div className='containerBox'>
            <div className='d-flex flex-row justify-content-left shadow-sm bg-light p-3'>
                <div className=' pl-3'>
                    <span>From Date</span>
                    <Form.Control type="datetime-local" className='form-control w-25 date-selecter ' onChange={handleFromYearChange} />
                </div>
                <div className=''>
                    <span>To Date</span>
                    <Form.Control type="datetime-local" className='form-control w-25 date-selecter ' onChange={handleTOYearChange} />
                </div>
                <div className=' mt-auto'>
                    <Button className='filter-btn' onClick={fetchData} disabled={!fromDate || !toDate}>
                        {loading ? <Spinner animation='border' variant='primary' /> : 'Filter'}
                    </Button>
                    <Button onClick={() => { setData(null) }} disabled={!data} className='btn btn-light'>
                        Reset
                    </Button>
                </div>
            </div>


            <Row className='spacing-'>
                <Col>
                    {/* <h2 className='font-weight-bold p-3'>Lead Generated Report</h2> */}
                    <LeadGeneratedReport dateFiltred={data && data} />
                </Col>
            </Row>

            <Row className='spacing-1 my-3 pl-3'>
                <Col>
                    {/* <h2 className='font-weight-bold p-3'>Lead By Model Report</h2> */}
                    <LeadByModelReport dateFiltred={data && data} />
                </Col>
            </Row>

            <Row className='spacing-1 my-3 p-3'>
                <Col>
                    {/* <h2 className='font-weight-bold'>Leads by Year</h2> */}
                    <LeadByYear dateFiltred={data && data} />
                </Col>
            </Row>
            <Row className='spacing-1 my-3 p-3'>
                <Col>
                    {/* <h2 className='font-weight-bold'>BDC Stats</h2> */}
                    <BdcStats dateFiltred={data && data} />
                </Col>
            </Row>

            <Row className='spacing-1 mt-3 p-3'>
                <Col>
                    <Report setUser={setUser} />
                </Col>
            </Row>




            {/* <Row className='spacing-1'>
                    <Col>
                        <h3>Bot ROs:</h3>
                        <p
                            style={{
                                fontSize: '0.85rem',
                                color: '#868e96',
                            }}>
                            Count of ROs that the bot is working on, grouped by RO date & dealer.
                        </p>
                        <React.Suspense fallback={<Loader />}>
                            <BotLeads />
                        </React.Suspense>
                    </Col>
                    <Col>
                        <h3>All Leads</h3>
                        <p
                            style={{
                                fontSize: '0.85rem',
                                color: '#868e96',
                            }}>
                            Count of leads created, grouped by date and dealership.
                        </p>
                        <React.Suspense fallback={<Loader />}>
                            <AllLeads />
                        </React.Suspense>
                    </Col>
                </Row>
                <Row className='spacing-1'>
                    <Col>
                        <h3>Open Leads Dealer-wise</h3>
                        <p
                            style={{
                                fontSize: '0.85rem',
                                color: '#868e96',
                            }}>
                            Count of open leads, grouped by dealer and created date.
                        </p>
                        <React.Suspense fallback={<Loader />}>
                            <OpenLeadsByDealer />
                        </React.Suspense>
                    </Col>
                    <Col>
                        <h3>Open Leads Owner-wise</h3>
                        <p
                            style={{
                                fontSize: '0.85rem',
                                color: '#868e96',
                            }}>
                            Count of open leads, grouped by owner and created date.
                        </p>
                        <React.Suspense fallback={<Loader />}>
                            <OpenLeadsByOwner />
                        </React.Suspense>
                    </Col>
                </Row>
                <Row className='spacing-1'>
                    <Col>
                        <h3>Leads Progression</h3>
                        <p
                            style={{
                                fontSize: '0.85rem',
                                color: '#868e96',
                            }}>
                            Various states in which leads lie. Count of leads grouped by created
                            date and status.
                        </p>
                        <React.Suspense fallback={<Loader />}>
                            <LeadProgression />
                        </React.Suspense>
                    </Col>
                    <Col></Col>
                </Row> */}



        </div >
    );
};
export default Dashboard;
