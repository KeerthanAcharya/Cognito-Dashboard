import React, { useContext, useEffect, useState } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart as chartJS, registerables } from 'chart.js';
import { dashboard } from '../../../controllers/dashboard';
import { UserContext } from '../../common/UserContext';
import { useQuery } from 'react-query';
import Loader from '../../common/Loader';
import config from '../../../config.json';
import { Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { toastify } from '../../common/notification';
import ReactPaginate from 'react-paginate';
const url = config['baseHost_backend'];
chartJS.register(...registerables);
function Report({ dateFiltred }: any) {
    const [scrollMin, setScrollMin] = useState(0)
    const [scrollMax, setScrollMax] = useState(9)
    const { authToken, type, ID } = useContext(UserContext);
    const [pageNumber, setPageNumber] = useState(0);
    const [rowPerPage, setRowperPage] = useState(10);
    const [myData, setmyData] = useState<any>(null)
    const [data, setData] = useState<any>(null)
    const [filter, setFilter] = useState<any>('All')
    const [displayData, setDisplayData] = useState<any>(null)
    const pageVisited = pageNumber * rowPerPage;
    const [loading, setLoading] = useState<boolean>(false)
    const { data: dashboardData, isLoading: isLeadsLoading } = useQuery('drm-dashboard', () =>
        dashboard(authToken)
    );
    const [BarXlength, setBarXlength] = useState<any>(null)

    useEffect(() => {
        if (dateFiltred) {
            setData(dateFiltred)
            console.log('date filtred', dateFiltred)
        }
        else {
            let userInfo = {
                data: {
                    actionType:'dashboardFetch',
                    type: type,
                    ID: type==='corporate' ? ID : Number(ID)
                }
            }
            setLoading(true)
            axios
                .post(`${url}/drm-dashboard`, userInfo, {
                    headers: {
                        authorization: `Bearer ${authToken}`,
                    },
                })
                .then((res) => {
                    setData(res.data.body.data)
                    setLoading(false)
                }
                )
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
    }, [dateFiltred])

    useEffect(() => {
        if (data && displayData) {
            console.log('display data', displayData)
            console.log('data2', data)
            const labelValue = filter === 'All' ? data?.vehicleByYear.filter((vehicle: any) => typeof (vehicle._id) === 'string' ? vehicle._id.split('').length === 4 : vehicle._id.toString().split('').length===4).sort((a: any, b: any) => (a._id > b._id) ? -1 : 1).map((vehicle: any) => vehicle._id) : displayData?.map((vehicle: any) => vehicle._id)
            setBarXlength(labelValue.length)
            setmyData({
                labels: labelValue,
                datasets: [
                    {
                        label: 'Percentage',
                        data: filter === 'All' ? data?.vehicleByYear.filter((vehicle: any) => typeof (vehicle._id) === 'string' ? vehicle._id.split('').length === 4 : vehicle._id.toString().split('').length===4).sort((a: any, b: any) => (a._id > b._id) ? -1 : 1).map((vehicle: any) => (Math.ceil(vehicle.percent))) : displayData?.map((vehicle: any) => (Math.ceil(vehicle.percent))),
                        backgroundColor: ['blue'],
                        barThickness: 40,
                        tension: 0.5
                    },
                ],
            })
        }
    }, [data, displayData, pageNumber, filter, scrollMax, scrollMin])

    let num = '2020';
    console.log(typeof (num))

    useEffect(() => {
        let tempArray = [] as any;
        if (data) {
            if (filter === 'All') {
                data?.vehicleByYear
                    .filter((vehicle: any) => typeof (vehicle._id) === 'string' ? vehicle._id.split('').length === 4 : vehicle._id.toString().split('').length===4)
                    .sort((a: any, b: any) =>
                        (a._id > b._id) ? -1 : 1)
                    .slice(pageVisited, pageVisited + rowPerPage)
                    .map((vehicle: any) => {
                        tempArray.push({
                            _id: vehicle._id,
                            percent: vehicle.percent,
                            count: vehicle.count
                        })
                    })
                setDisplayData(tempArray);

            }
            else {
                data?.vehicleByYear.filter((vehicle: any) => vehicle._id === filter)
                    .sort((a: any, b: any) =>
                        (a.count > b.count) ? -1 : 1)
                    .slice(pageVisited, pageVisited + rowPerPage)
                    .map((vehicle: any) => {
                        tempArray.push({
                            _id: vehicle._id,
                            percent: vehicle.percent,
                            count: vehicle.count
                        })
                    })
                setDisplayData(tempArray);
            }
        }
    }, [data, filter, pageNumber])

    useEffect(() => {

    }, [])


    let pageCount =
        filter === 'All' ?
            Math.ceil(data?.vehicleByYear?.filter((vehicle: any) => typeof (vehicle._id) === 'string' && vehicle._id.split('').length === 4).length / rowPerPage)
            : Math.ceil(displayData?.length / rowPerPage)




    const handleFilter = (e: any) => {
        setFilter(e.target.value)
    }

    const handlePageClick = (Selected: any) => {
        console.log('selected', Selected.selected)
        setPageNumber(Selected.selected)

    }

    return loading ? (
        <Loader />
    ) : (
        <Row className="container row w-100 container row w-100 d-flex justify-content-center m-auto">
            <h2 className='font-weight-bold py-2'>Leads by Year</h2>
            <Col className='spacing-1'>
                <table className="table">
                    <thead className="thead-dark bg-dark text-white">
                        <tr>
                            <th scope="col">Year</th>
                            <th scope="col">Count</th>
                            <th scope="col">Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            displayData?.length >= 0 ?
                                displayData?.map((data: any, index: any) => (
                                    <>
                                        <tr>
                                            <td>{data._id}</td>
                                            <td>{data.count}</td>
                                            <td>{Math.ceil(data.percent)}%</td>
                                        </tr>
                                    </>
                                )) : <div><h3>No Data Found</h3></div>
                        }
                    </tbody>
                </table>
                <ReactPaginate
                    nextLabel=">>"
                    onPageChange={handlePageClick}
                    pageCount={data?.vehicleByYear?.length >= rowPerPage ? pageCount : 1}
                    previousLabel="<<"
                    containerClassName='pagination'
                    pageClassName={filter === 'All' ? 'pagination' : 'page-item disabled'}
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
            <Col className={myData?.labels?.length < 1 ? 'pacing-1 d-flex m-auto justify-content-center' : 'pacing-1'}>
                {myData?.labels?.length < 1 ? <div><h3>No Data Found</h3></div> :
                    (<>
                        <Form.Select className='mb-3 select-field' onChange={handleFilter}>
                            <option value="All">Year</option>
                            {
                                data?.vehicleByYear.filter((vehicle: any) => typeof (vehicle._id) === 'string' && vehicle._id.split('').length === 4).map((vehicle: any, index: any) => (
                                    <option value={vehicle._id} key={index}>{vehicle._id}</option>
                                ))
                            }

                        </Form.Select>


                        <div style={{ height: '400px' }}>
                            {myData &&
                                <Line
                                    data={myData}
                                    width="100px"
                                    height="100px"
                                    options={{
                                        responsive: true, maintainAspectRatio: false,
                                        scales: {
                                            xAxes: {
                                                ticks: { autoSkip: false },
                                                min: scrollMin,
                                                max: scrollMax,
                                            },
                                            yAxes: {
                                                ticks: {
                                                    stepSize: 5, callback: function (value, index, ticks) {
                                                        return value + '%';
                                                    }
                                                },

                                            }
                                        }
                                    }} />}

                        </div>
                        <div className='d-flex justify-content-between'>
                            <button className='btn btn-light shadow-lg' disabled={scrollMin === 0 || filter !== 'All'} onClick={() => {
                                setScrollMin(scrollMin - 10)
                                setScrollMax(scrollMax - 10)
                            }}>Prev</button>
                            <button className='btn btn-light shadow-lg' disabled={BarXlength < scrollMax || filter !== 'All'} onClick={() => {
                                setScrollMin(scrollMin + 10)
                                setScrollMax(scrollMax + 10)
                            }}>Next</button>
                        </div>
                    </>)}

            </Col>
        </Row >
    )
}


export default Report