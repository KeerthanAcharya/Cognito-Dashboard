import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap';
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
import LoadingBar from '../common/LoadingBar';
// import YearPicker from "react-year-picker";

const Dashboard = ({ setUser }: { setUser: Function }) => {
    const { authToken, type, ID } = useContext(UserContext);
    const [fromDate, setFromDate] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [toDate, setToDate] = useState<any>(null)
    const [data, setData] = useState<any>(null)
    const url = config['baseHost_backend'];
    const [selectedDealerID, setSelectedDealerID] = useState<any>(null)
    const [filteredDealersAndStates, setFilteredDealersAndStates] = useState<any>(null)
    const [location, setLocation] = useState<any>(null)
    const [brand, setBrand] = useState<any>(null)
    const fromDateControl = useRef<any>(null)
    const [filterCount, setFilterCount] = useState<any>(null)
    const handleFromYearChange = (e: any) => {
        console.log('date 1', e.target.value)
        setFromDate(e.target.value)
        setFilters({ ...filters, fromDate: e.target.value })
        setUser((prev: any) => ({ ...prev, fromDate: e.target.value }))
    }
    const handleTOYearChange = (e: any) => {
        console.log('date 2', e.target.value)
        setToDate(e.target.value)
        setFilters({ ...filters, toDate: e.target.value })
        setUser((prev: any) => ({ ...prev, toDate: e.target.value }))
    }
    const [filters, setFilters] = useState<any>({
        fromDate: null,
        toDate: null,
        selectedDealerID: null,
        location: null,
        brand: null,
        ID: type === 'corporate' ? ID : Number(ID),
        type: type,

    })

    let val = 0;
    Object.entries(filters).forEach(
        ([key, value]) => {
            value && value !== "null" && value !== "All" && val++
            console.log('Filter payload 2', key, value)
        }


    );
    useEffect(() => {
        setFilterCount(val - 2)
    }, [filters])

    console.log('filterd count', val - 2)



    const clearForm = () => {
        setFromDate(null);
        setToDate(null);
        setBrand(null);
        setSelectedDealerID(null);
        setLocation(null);

        setFilters({ ...filters, fromDate: null, toDate: null, location: null, selectedDealerID: null, brand: null })
        // setFilters({...filters,toDate:null})
        // setFilters({...filters,location:null})
        // setFilters({...filters,selectedDealerID:null})
        // setFilters({ ...filters, brand: null })
        // setFilters({})
    }
    const fetchData = (e: any) => {
        e.preventDefault();
        let dateStr
        let iso1;
        let iso2;
        if (fromDate) {
            dateStr = new Date(fromDate);
            iso1 = dateStr.toISOString();
        }

        if (toDate) {
            let dateStr1
            dateStr1 = new Date(toDate);
            iso2 = dateStr1.toISOString();
        }

        let bodyData = {
            actionType: "masterFilter",
            dateFrom: fromDate ? iso1 : null,
            dateto: toDate ? iso2 : null,
            brand: brand,
            selectedDealerID,
            type: type,
            location: location,
            ID: type === 'corporate' ? ID : Number(ID)
        }
        console.log('Filter payload 1', bodyData)

        setLoading(true);
        axios
            .post(`${url}/drm-dashboard`, bodyData, {
                headers: {
                    authorization: `Bearer ${authToken}`,
                },
            })
            .then((res) => {
                setData(res?.data?.body?.data)
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
                    error.response?.data?.message?.length > 0
                        ? error.response.data.message
                        : 'Something went wrong'
                )
            })
    }


    useEffect(() => {
        if (type === 'corporate') {
            setLoading(true)
            const url = config['baseHost_backend'] + '/drm-create-user';
            let body = {
                selectType: {
                    ID: ID,
                    type: 'corporate'
                }
            }
            axios.post(url, body).then((resp) => {
                console.log('Type responce', resp)
                setFilteredDealersAndStates(resp?.data?.body)
                setLoading(false)
            }).catch((err) => {
                console.log('Error', err)
                setLoading(false)
            })
        }

    }, [type])

    const handleDealerSelect = async (e: any) => {
        setSelectedDealerID(e.target.value)
        setFilters({ ...filters, selectedDealerID: e.target.value })
        // fetchData({ functionType: 'dealerFilter', val: e.target.value })
        e.target.value === 'All' && setData(null)
    }
    console.log('dealers', filteredDealersAndStates)

    return (

        <div className='containerBox'>

            <form className='d-flex flex-row justify-content-left shadow-sm bg-light p-3 filter-header' onSubmit={fetchData} ref={fromDateControl}>
                <div className=' pl-3'>
                    <span>From Date</span>
                    <Form.Control type="datetime-local" className='form-control w-25  size date-selecter p-1' onChange={handleFromYearChange} />
                </div>
                <div className=''>
                    <span>To Date</span>
                    <Form.Control type="datetime-local" className='form-control w-25  size date-selecter p-1' onChange={handleTOYearChange} />
                </div>
                {/* <div className=' mt-auto'>
                    <Button className='filter-btn btn-sm' onClick={() => {fetchData({functionType:'dateFilter',val:""}) }} disabled={!fromDate || !toDate}>
                        {loading ? <Spinner animation='border' variant='primary' /> : 'Filter'}
                    </Button>
                    <Button onClick={() => { setData(null) }} disabled={!data} className='btn btn-light btn-sm'>
                        Reset
                    </Button>
                </div> */}
                {type === 'corporate' && (
                    <div className=' mt-auto w-25 size'>
                        <InputGroup className='input '>
                            <Form.Select
                                className='p-2'
                                size='sm'
                                aria-describedby='basic-addon1'
                                onChange={(e) => { setLocation(e.target.value); setFilters({ ...filters, location: e.target.value }) }}
                            >
                                <option value="null">Select Location</option>
                                {filteredDealersAndStates?.filterdStatesandDealer?.map((filter: any) => (
                                    <option value={filter._id.state}>{filter._id.state}</option>
                                ))}
                            </Form.Select>
                        </InputGroup>
                    </div>
                )}

                {type === 'corporate' && (<div className=' mt-auto w-25 size'>
                    <InputGroup className='input '>
                        <Form.Select
                            className='p-2'
                            size='sm'
                            aria-describedby='basic-addon1'
                            onChange={(e) => { setBrand(e.target.value); setFilters({ ...filters, brand: e.target.value }) }}
                        >
                            <option value="null">Select Brand</option>
                            {filteredDealersAndStates?.brand?.filter((data: any) => data._id).map((filter: any) => (
                                <option value={filter._id}>{filter._id}</option>
                            ))}
                        </Form.Select>
                    </InputGroup>
                </div>)}

                {type === 'corporate' && (
                    <div className=' mt-auto w-25 size'>
                        <InputGroup className='input '>
                            <Form.Select
                                className='p-2'
                                size='sm'
                                aria-describedby='basic-addon1'
                                onChange={handleDealerSelect}
                            >
                                <option value="All">Select dealer</option>
                                {filteredDealersAndStates?.filterdStatesandDealer?.map((filter: any) => (
                                    <option value={filter._id.dealerID}>{filter._id.first_name + ' ' + filter._id.last_name}</option>
                                ))}
                            </Form.Select>
                        </InputGroup>
                    </div>
                )}
                <div className=' d-flex flex-row'>
                    {filterCount !== 0 && (
                        <span className='filter-count'>{filterCount}</span>
                    )}

                    <Button className='filter-btn btn-sm mb-auto mt-auto' type='submit'
                    // onClick={fetchData}
                    // disabled={!fromDate || !toDate}
                    >

                        {'Filter'}
                    </Button>

                    <Button onClick={() => {
                        setData(null);
                        // setFromDate(null)
                        fromDateControl.current.reset()
                        clearForm()
                    }}
                        // disabled={!data}
                        className='btn btn-light btn-sm mb-auto mt-auto'>
                        Reset
                    </Button>
                </div>
            </form>


            <LoadingBar isActive={loading} />
            <Row className='spacing-1 mt-10'>
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
