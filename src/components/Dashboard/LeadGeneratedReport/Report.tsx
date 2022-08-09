import React, { useContext, useEffect, useState } from 'react'
import { Pie, Bar } from 'react-chartjs-2'
// import { ModelsData } from '../Data'
import { Chart as chartJS, registerables, Tooltip } from 'chart.js';
import { dashboard } from '../../../controllers/dashboard';
import { useQuery } from 'react-query';
import { ColumnDescription } from 'react-bootstrap-table-next';
import { UserContext } from '../../common/UserContext';
import { allLeadsApi } from '../../../controllers/leads';
import { CustomTable } from '../../common/customTable';
import axios from "axios";
import config from '../../../config.json';
import { toastify } from "../../common/notification";
import Loader from '../../common/Loader';
import { Col, Row, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
const url = config['baseHost_backend'];
chartJS.register(...registerables, Tooltip);
function Report({ dateFiltred }: any) {
    const [totalLead, setTotalLead] = useState(null)
    const [customerNoResponded, setCustomerResponsed] = useState(null)
    const { authToken } = useContext(UserContext);
    const [myData, setmyData] = useState<any>(null)

    const [rowPerPage, setRowperPage] = useState(10);
    // const [pieData,setPieData]=useState<any>({})
    const [allLeadsPage, setAllLeadsPage] = useState(1);
    const [pageNumber, setPageNumber] = useState(0);
    const [data, setData] = useState<any>(null)
    const [displayData, setDisplayData] = useState<any>(null)
    const [filter, setFilter] = useState<any>('All')
    const [scrollMin, setScrollMin] = useState(0)
    const [scrollMax, setScrollMax] = useState(9)
    const [loading, setLoading] = useState<boolean>(false)
    const { data: dashboardData, isLoading: isLeadsLoading } = useQuery('test-dashboard', () =>
        dashboard(authToken)
    );

    useEffect(() => {
        if (dateFiltred) {
            setData(dateFiltred)
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
                    console.log('res', res)
                    setData(res.data.body.data)
                    setLoading(false)
                    // setTotalLead(res?.data?.body?.data?.totalLead)
                    // setCustomerResponsed(res?.data?.body?.data?.customerNoResponded)
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
        let botResponce = data?.botResponse;
        let totalLead = data?.totalLead;
        let customerResponded = data?.customerResponded;
        let customerNoResponded = data?.customerNoResponded;



        // let botResponcePercent = botResponce && botResponce / totalLead && totalLead;
        // botResponcePercent = botResponcePercent * 100;

        let customerRespondedPercent = customerResponded / botResponce;
        customerRespondedPercent = customerRespondedPercent * 100;

        let customerNoRespondedPercent = customerNoResponded / botResponce;
        customerNoRespondedPercent = customerNoRespondedPercent * 100;

        console.log('total bot %', totalLead)
        console.log('customerRespondedPercent %', customerRespondedPercent)
        console.log('customerNoRespondedPercent %', customerNoRespondedPercent)


        if (data) {
            console.log('display data', displayData)
            console.log('data2', data)
            setmyData({
                labels: ['No. of customers responded (%)', 'No. of customers not responded (%)'],
                datasets: [
                    {
                        labels: "Total",
                        data: [Math.ceil(customerRespondedPercent), Math.ceil(customerNoRespondedPercent)],
                        backgroundColor: ['green', 'orange'],
                        barThickness: 40
                    },
                ],
            })
            console.log("🚀 ~ file: Report.tsx ~ line 24 ~ Report ~ myD̥ata", myData && myData)
        }
    }, [data, displayData, pageNumber, filter, scrollMax, scrollMin])

    const handlePageClick = (Selected: any) => {
        console.log('selected', Selected.selected)
        setPageNumber(Selected.selected)
    }

    let pageCount = Math.ceil(dashboardData && dashboardData?.body?.data?.carModel?.length / rowPerPage);

    // useEffect(() => {
    //     if (dateFiltred) {
    //         setData(dateFiltred)
    //         console.log('date filtred', dateFiltred)
    //     }
    // }, [dateFiltred])


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
    //                 labels: ['Total number of Lead Generated', 'No Responce'],
    //                 datasets: [
    //                     {
    //                         label: 'Total',
    //                         data: [res?.data?.body?.data?.totalLead, res?.data?.body?.data?.customerNoResponded],
    //                         backgroundColor: ['purple', 'orange'],
    //                         barThickness: 50,
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

    // useEffect(() => {
    //     drawChart()
    // }, [])


    return loading ? <Loader /> : (
        <Row style={{ width: '500px' }} className="container row w-100 d-flex justify-content-center m-auto">
            <Col className='spacing-1'>
                <table className="table">
                    <thead className="thead-dark bg-dark text-white">
                        <tr>
                            <th scope="col">Result</th>
                            <th scope="col">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <tr>
                            <td>Total number of leads generated</td>
                            <td>{data?.totalLead}</td>
                        </tr> */}
                        <tr>
                            <td>Messages sent by the BoT</td>
                            <td>{data?.botResponse}</td>
                        </tr>
                        <tr>
                            <td>No. of customers responded</td>
                            <td>{data?.customerResponded}</td>
                        </tr>
                        <tr>
                            <td>No. of customers not responded</td>
                            <td>{data?.customerNoResponded}</td>
                        </tr>

                    </tbody>
                </table>
                <ReactPaginate
                    nextLabel=">>"
                    onPageChange={handlePageClick}
                    pageCount={1}
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

            <Col className='spacing-1 d-flex m-auto justify-content-center'>
                {!myData?.datasets[0]?.data[0] && !loading ? (<div><h3>No Data Found</h3></div>) :
                    (<div style={{ width: '350px' }}>
                        {myData && <Pie data={myData} />}
                    </div>)}
            </Col>
        </Row>
    )
}

export default Report