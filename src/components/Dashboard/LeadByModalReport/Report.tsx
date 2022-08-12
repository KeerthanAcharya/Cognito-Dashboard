import React, { useContext, useEffect, useState } from 'react'
import { Pie, Bar } from 'react-chartjs-2'
// import { ModelsData } from '../Data'
import { Chart as chartJS, registerables, Tooltip } from 'chart.js';
import { dashboard } from '../../../controllers/dashboard';
import { useQuery } from 'react-query';
import { ColumnDescription, TableChangeHandler } from 'react-bootstrap-table-next';
import { UserContext } from '../../common/UserContext';
import { allLeadsApi } from '../../../controllers/leads';
import { CustomTable } from '../../common/customTable';
import axios from "axios";
import config from '../../../config.json';
import { toastify } from "../../common/notification";
import Loader from '../../common/Loader';
import ReactPaginate from 'react-paginate';
import { Col, Row, Modal, Card, Form, Button, Table, Tab, Nav } from 'react-bootstrap';
const url = config['baseHost_backend'];
chartJS.register(...registerables, Tooltip);
function Report({ dateFiltred }: any) {
    const [scrollMin, setScrollMin] = useState(0)
    const [scrollMax, setScrollMax] = useState(9)

    const [BarXlength,setBarXlength]=useState<any>(null)

    const { authToken,type,ID } = useContext(UserContext);
    const [myData, setmyData] = useState<any>(null)
    const [filter, setFilter] = useState<any>('All')
    const { data: dashboardData, isLoading: isLeadsLoading } = useQuery('drm-dashboard', () =>
        dashboard(authToken)
    );
    const [pageNumber, setPageNumber] = useState(0);
    const [rowPerPage, setRowperPage] = useState(10);
    const [data, setData] = useState<any>(null)
    const [displayData, setDisplayData] = useState<any>(null)
    const pageVisited = pageNumber * rowPerPage;
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        if (dateFiltred) {
            setData(dateFiltred)
            console.log('date filtred', dateFiltred)
        }
        else {
            let userInfo = {
                data: {
                    type: type,
                    ID: Number(ID)
                }
            }
            setLoading(true)
            axios
                .post(`${url}/drm-dashboard`,userInfo, {
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
            const labelValue=filter === 'All' ? data?.carModel.sort((a: any, b: any) =>
            (a.percent > b.percent) ? -1 : 1).filter((model: any) => typeof (model._id) === 'string' && model._id.split('').length > 1).map((car: any) => car._id) : displayData?.map((car: any) => car._id)
            setBarXlength(labelValue.length)
            setmyData({
                labels: labelValue,
                datasets: [
                    {
                        label: 'Percentage of Lead Generation',
                        data: filter === 'All' ? data?.carModel.sort((a: any, b: any) =>
                            (a.percent > b.percent) ? -1 : 1).filter((model: any) => typeof (model._id) === 'string' && model._id.split('').length > 1).map((car: any) => (Math.ceil(car.percent))) : displayData?.map((car: any) => (Math.ceil(car.percent))),
                        backgroundColor: ['blue'],
                        barThickness: 40,
                    },
                ],
            })
        }
    }, [data, displayData, pageNumber, filter, scrollMax, scrollMin])


    useEffect(() => {

        let tempArray = [] as any;
        if (data) {
            console.log('data after date filter', data?.carModel.length)
            if (filter === 'All') {
                data?.carModel
                    .filter((model: any) => typeof (model._id) === 'string' && model._id.split('').length > 1)
                    .sort((a: any, b: any) =>
                        (a.count > b.count) ? -1 : 1)
                    .slice(pageVisited, pageVisited + rowPerPage)
                    .map((car: any) => {
                        tempArray.push({
                            _id: car._id,
                            percent: car.percent,
                            count: car.count
                        })
                    })
                setDisplayData(tempArray);

            }
            else {
                data?.carModel.filter((car: any) => car._id === filter)
                    .sort((a: any, b: any) =>
                        (a.count > b.count) ? -1 : 1)
                    .slice(pageVisited, pageVisited + rowPerPage)
                    .map((car: any) => {
                        tempArray.push({
                            _id: car._id,
                            percent: car.percent,
                            count: car.count
                        })
                    })
                setDisplayData(tempArray);
            }
        }
    }, [data, filter, pageNumber])


    console.log('sdsd', dashboardData && dashboardData?.length)



    // let pageCount =
    //  filter === 'All'
    //  ? Math.ceil(dashboardData && dashboardData?.body?.data?.carModel?.length / rowPerPage) 
    //  : Math.ceil(displayData?.length / rowPerPage)

    let pageCount =
        dateFiltred ? Math.ceil(data?.carModel?.length / rowPerPage) :
            !dateFiltred && filter === 'All' ? Math.ceil(dashboardData && dashboardData?.body?.data?.carModel?.length / rowPerPage) :
                Math.ceil(displayData?.length / rowPerPage)





    const handleFilter = (e: any) => {
        setFilter(e.target.value)
    }

    const handlePageClick = (Selected: any) => {
        console.log('selected', Selected.selected)
        setPageNumber(Selected.selected)

    }



    // const displayData = filter === 'All' ? dashboardData && dashboardData?.body?.data?.carModel
    //     .sort((a: any, b: any) =>
    //         (a.count > b.count) ? -1 : 1)
    //     .slice(pageVisited, pageVisited + rowPerPage)
    //     .map((car: any) => {
    //         return (
    //             <tr>
    //                 <td>{car._id}</td>
    //                 <td>{Math.ceil((car.count / dashboardData?.body?.data?.totalLead) * 100)}%</td>
    //             </tr>
    //         )
    //     }) :
    //     dashboardData && dashboardData?.body?.data?.carModel.filter((car: any) => car._id === filter)
    //         .sort((a: any, b: any) =>
    //             (a.count > b.count) ? -1 : 1)
    //         .slice(pageVisited, pageVisited + rowPerPage)
    //         .map((car: any) => {
    //             return (
    //                 <tr>
    //                     <td>{car._id}</td>
    //                     <td>{Math.ceil((car.count / dashboardData?.body?.data?.totalLead) * 100)}%</td>
    //                 </tr>
    //             )
    //         })

    // const drawChart = () => {
    //     axios
    //         .get(`${url}/test-dashboard`, {
    //             headers: {
    //                 authorization: `Bearer ${authToken}`,
    //             },
    //         })
    //         .then((res) => {
    //             console.log('res', res)
    //             setTotalLead(res?.data?.body?.data?.totalLead)
    //             setCustomerResponsed(res?.data?.body?.data?.customerNoResponded)

    //             setmyData({
    //                 labels: res?.data?.body?.data?.carModel.map((car: any) => car._id),
    //                 datasets: [
    //                     {
    //                         label: 'Percentage of Lead Generation',
    //                         data: res?.data?.body?.data?.carModel.map((car: any) => ((car.count / res?.data?.body?.data?.totalLead) * 100)),
    //                         backgroundColor: ['blue'],
    //                         barThickness: 40,
    //                     },
    //                 ],
    //             })

    //         }
    //         )
    //         .catch((error) =>
    //             toastify(
    //                 'failure',
    //                 error.response.data.message.length > 0
    //                     ? error.response.data.message
    //                     : 'Something went wrong'
    //             )
    //         );
    // }

    console.log('myData', myData)
    return loading ? <Loader /> : (
        <Row style={{ width: '500px' }} className="container row w-100 container row w-100 d-flex justify-content-center m-auto">
            <h2 className='font-weight-bold py-2'>Lead By Model Report</h2>
            <Col className='spacing-1'   >
            
                <table className="table">
                    <thead className="thead-dark bg-dark text-white">
                        <tr>
                            <th scope="col">Model Name</th>
                            <th scope="col">Count</th>
                            <th scope="col">Percentage of Leads</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayData?.length > 0 ?
                            displayData?.map((car: any, index: any) => (
                                <tr>
                                    <td>{car._id}</td>
                                    <td>{(car.count)}</td>
                                    <td>{Math.ceil(car.percent)}%</td>
                                </tr>
                            ))
                            : <div><h3>No Data Found</h3></div>}
                    </tbody>

                </table>
                <ReactPaginate
                    nextLabel=">>"
                    onPageChange={handlePageClick}
                    pageCount={data?.carModel?.length>rowPerPage  ? pageCount : 1}
                    previousLabel="<<"
                    containerClassName='pagination'
                    pageClassName={filter === 'All'  ? 'pagination' : 'page-item disabled'}
                    // pageClassName='page-item'
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

            <Col className={myData?.labels?.length < 1 ? "pacing-1 d-flex m-auto justify-content-center" : "pacing-1"}>
                {myData?.labels?.length < 1 ? <div><h3>No Data Found</h3></div> :
                    (<>
                        <Form.Select className='mb-3 select-field' onChange={handleFilter}>
                            <option value="All">Model Name</option>
                            {
                                data?.carModel.filter((model: any) => typeof (model._id) === 'string' && model._id.split('').length > 1).map((car: any, index: any) => (
                                    <option value={car._id} key={index}>{car._id}</option>
                                ))
                            }

                        </Form.Select>

                        <div style={{ height: '600px' }}>
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
                                            ticks: {
                                                stepSize: 1, callback: function (value, index, ticks) {
                                                    return value + '%';
                                                }
                                            }
                                        }
                                    }
                                }} />}
                        </div>
                        <div className='d-flex justify-content-between'>
                            <button className='btn btn-light shadow-lg' disabled={scrollMin === 0 || filter !== 'All'} onClick={() => {
                                setScrollMin(scrollMin - 10)
                                setScrollMax(scrollMax - 10)
                            }}>Prev</button>
                            <button className='btn btn-light shadow-lg' disabled={(BarXlength < scrollMax) || filter !== 'All'} onClick={() => {
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