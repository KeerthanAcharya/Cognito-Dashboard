import React, { useContext, useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
// import { ModelsData } from '../Data'
import { Chart as chartJS, registerables } from 'chart.js';
import { dashboard } from '../../../controllers/dashboard';
import { useQuery } from 'react-query';
import { UserContext } from '../../common/UserContext';
import { allLeadsApi } from '../../../controllers/leads';
import { Col, Form, Row } from 'react-bootstrap';
import Loader from '../../common/Loader';
import { toastify } from '../../common/notification';
import axios from 'axios';
import config from '../../../config.json';
import ReactPaginate from 'react-paginate';
import { any } from 'ramda';
const url = config['baseHost_backend'];
chartJS.register(...registerables);
function Report({ dateFiltred }: any) {
    const { authToken, soldvalue } = useContext(UserContext);
    const [myData, setmyData] = useState<any>(null)
    const { data: datas } = useQuery('test-dashboard', () =>
        dashboard(authToken)
    );
    const [filter, setFilter] = useState<any>('All')
    const [rowPerPage, setRowperPage] = useState(10);
    const [pageNumber, setPageNumber] = useState(0);
    const [scrollMin, setScrollMin] = useState(0)
    const [scrollMax, setScrollMax] = useState(9)
    const [displayData, setDisplayData] = useState<any>(null)
    const pageVisited = pageNumber * rowPerPage;
    const [data, setData] = useState<any>(null)
    const { data: dashboardData, isLoading: isLeadsLoading } = useQuery('dashboard', () =>
        dashboard(authToken)
    );
    const [loading, setLoading] = useState<boolean>(false)
    const [status, setStatus] = useState<any>([
        {
            sortNumber: 1,
            text: 'total_leads',
            ctaText: 'Total Leads',
            value: 0
        },
        {
            sortNumber: 2,
            text: 'no_responce',
            ctaText: 'No Response(still chasing)',
            value: 0
        },
        {
            sortNumber: 3,
            text: 'not_interested',
            ctaText: 'Not Interested',
            value: 0
        },
        {
            sortNumber: 4,
            text: 'possible',
            ctaText: 'Possible(Other dependencies)',
            value: 0
        },
        {
            sortNumber: 5,
            text: 'appointments',
            ctaText: 'Appointments',
            value: 0
        },
        {
            sortNumber: 6,
            text: 'sold',
            ctaText: 'Sold',
            value: 0
        },
        {
            sortNumber: 7,
            text: 'working',
            ctaText: 'Working',
            value: 0
        },
        {
            sortNumber: 8,
            text: 'showed',
            ctaText: 'Showed(no deal)',
            value: 0
        },
    ])

    console.log('BDC stats soldvalue', soldvalue)
    useEffect(() => {
        let appointmentCount: any;
        let bot_working: any;
        let newdata: any;

        if (dateFiltred) {
            setLoading(true)
            setData(dateFiltred)
            appointmentCount = dateFiltred?.status.filter((status: any) => status._id === 'appointment')
            bot_working = dateFiltred?.status.filter((status: any) => status._id === 'bot_working')

            newdata = status?.map((status: any) => (
                status.text === 'no_responce' ?
                    { ...status, value: dateFiltred?.customerNoResponded }
                    : status.text === 'total_leads' ?
                        { ...status, value: dateFiltred?.totalLead }
                        : status.text === 'appointments' ?
                            { ...status, value: appointmentCount && appointmentCount[0]?.count ? appointmentCount[0]?.count : 0 }
                            : status.text === 'sold' ?
                                { ...status, value: soldvalue }
                                : status.text === 'working' ?
                                    { ...status, value: bot_working && bot_working[0]?.count ? bot_working[0]?.count : 0 }
                                    : status
            ))
            setStatus(newdata)
            setLoading(false)
            console.log('date filtred', dateFiltred)
        }
        else {
            setLoading(true)
            axios
                .get(`${url}/test-dashboard`, {
                    headers: {
                        authorization: `Bearer ${authToken}`,
                    },
                })
                .then((res) => {
                    setData(res.data.body.data);
                    appointmentCount = res.data.body.data.status.filter((status: any) => status._id === 'appointment')
                    bot_working = res.data.body.data.status.filter((status: any) => status._id === 'bot_working')

                    newdata = status?.map((status: any) => (
                        status.text === 'no_responce' ?
                            { ...status, value: res.data.body.data.customerNoResponded }
                            : status.text === 'total_leads' ?
                                { ...status, value: res.data.body.data.botResponse }
                                : status.text === 'appointments' ?
                                    { ...status, value: appointmentCount && appointmentCount[0]?.count }
                                    : status.text === 'sold' ?
                                        { ...status, value: soldvalue }
                                        : status.text === 'working' ?
                                            { ...status, value: bot_working && bot_working[0]?.count }
                                            : status
                    ))
                    setStatus(newdata)
                    setLoading(false)

                })
                .catch((error) => {
                    toastify(
                        'failure',
                        error.response.data.message.length > 0
                            ? error.response.data.message
                            : 'Something went wrong'
                    )
                    console.log('error')
                    setLoading(false)
                }
                );
        }
    }, [soldvalue, dateFiltred])



    useEffect(() => {
        if (data && displayData) {
            console.log('display data', displayData)
            console.log('data2', data)
            setmyData({
                labels: filter === 'All' ? status?.map((status: any) => status.ctaText) : displayData?.map((status: any) => status.ctaText),
                datasets: [
                    {
                        label: 'Total',
                        data: filter === 'All' ? status?.map((status: any) => (status.value)) : displayData?.map((status: any) => (Math.ceil(status.count))),
                        backgroundColor: ['blue'],
                        barThickness: 40,
                    },
                ],
            })
        }
    }, [data, displayData, pageNumber, filter, scrollMax, scrollMin])

    useEffect(() => {
        let filteredData;
        let tempArray = [] as any;
        if (data) {
            if (filter === 'All') {
                data?.status
                    .sort((a: any, b: any) =>
                        (a.count > b.count) ? -1 : 1)
                    .slice(pageVisited, pageVisited + rowPerPage)
                    .map((status: any) => {
                        tempArray.push({
                            _id: status._id,
                            percent: status.percent,
                            count: status.count
                        })
                    })
                setDisplayData(tempArray);

            }
            else {
                data?.status.filter((status: any) => status._id === filter)
                    .sort((a: any, b: any) =>
                        (a.count > b.count) ? -1 : 1)
                    .slice(pageVisited, pageVisited + rowPerPage)
                    .map((status: any) => {
                        tempArray.push({
                            _id: status._id,
                            percent: status.percent,
                            count: status.count
                        })
                    })
                setDisplayData(tempArray);
            }
        }
    }, [data, filter, pageNumber])

    let pageCount = Math.ceil(dashboardData && dashboardData?.body?.data?.status?.length / rowPerPage)

    const handleFilter = (e: any) => {
        setFilter(e.target.value)
    }

    const handlePageClick = (Selected: any) => {
        console.log('selected', Selected.selected)
        setPageNumber(Selected.selected)

    }

    return loading ? <Loader /> : (
        <Row style={{ width: '500px' }} className="container row w-100  d-flex justify-content-center m-auto">
            <h2 className='font-weight-bold py-2'>BDC Stats</h2>
            <Col className='spacing-1'>
                <table className="table">
                    <thead className="thead-dark bg-dark text-white">
                        <tr>
                            <th scope="col">BDC Breakdown</th>
                            <th scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            status?.map((status: any, index: any) => (
                                <tr>
                                    <td>{status.ctaText}</td>
                                    <td>{status.value}</td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
                <ReactPaginate
                    nextLabel=">>"
                    onPageChange={handlePageClick}
                    pageCount={pageCount}
                    previousLabel="<<"
                    // containerClassName='pagination'
                    containerClassName={isLeadsLoading || filter !== 'All' ? 'd-none' : 'pagination'}
                    pageClassName='page-item disabled'
                    pageLinkClassName='page-link'
                    previousClassName='page-item'
                    previousLinkClassName='page-link'
                    nextClassName='page-item'
                    nextLinkClassName='page-link'
                    breakLabel='...'
                    breakLinkClassName='page-link'
                    activeClassName='active'
                    breakClassName='page-item'
                />
            </Col>
            <Col className={!myData?.datasets[0]?.data[0] ? "spacing-1 d-flex mt-5 justify-content-center" : "spacing-1"}>
                {!myData?.datasets[0]?.data[0] ? <div><h3>No Data Found</h3></div> :
                    (<>
                        <div style={{ height: '700px' }}>
                            {myData && <Bar
                                data={myData}
                                width="100px"
                                height="100px"
                                options={{
                                    responsive: true, maintainAspectRatio: false,
                                    scales: {
                                        xAxes: {
                                            ticks: { autoSkip: false }, min: scrollMin, max: scrollMax
                                        },
                                        yAxes: {
                                            ticks: { stepSize: 25 }
                                        }
                                    }
                                }} />}
                        </div>
                        <div className='d-flex justify-content-between'>
                            <button className='btn btn-light shadow-lg' disabled={true} onClick={() => {
                                setScrollMin(scrollMin - 10)
                                setScrollMax(scrollMax - 10)
                            }}>Prev</button>
                            <button className='btn btn-light shadow-lg' disabled={true} onClick={() => {
                                setScrollMin(scrollMin + 10)
                                setScrollMax(scrollMax + 10)
                            }}>Next</button>
                        </div>
                    </>)}
            </Col>

        </Row>
    )
}

export default Report