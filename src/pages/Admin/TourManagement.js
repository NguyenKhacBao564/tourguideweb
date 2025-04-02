import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Container, Button } from "react-bootstrap";
import AddTourArea from "../../components/AddTourArea/AddTourArea";
import { Row, Col } from "react-bootstrap";

const TourManagement = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/tours")
      .then(response => setTours(response.data))
      .catch(error => console.error("Lỗi khi lấy dữ liệu:", error));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tour này?")) {
      axios.delete(`http://localhost:5000/tours/${id}`)
        .then(() => {
          setTours(tours.filter(tour => tour.tour_id !== id)); 
        })
        .catch(error => console.error("Lỗi khi xóa người tour:", error));
    }
  };
  return (
    <Container>
      <Row>
       <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium esse quod eum. Voluptatibus quasi assumenda illum fugit neque earum ducimus qui, dignissimos autem asperiores, dolore cupiditate debitis rem nihil accusantium.
       Porro commodi consequatur nihil necessitatibus officiis expedita dolorem doloremque beatae totam, natus ipsam, reprehenderit ipsum impedit omnis nobis ex enim! Id fugiat maxime blanditiis harum asperiores! Placeat quidem suscipit corporis.
       Eligendi, modi necessitatibus. Tempora, dolore nostrum! Voluptates numquam facilis, labore mollitia minus magni omnis libero et quisquam totam ipsam vel veniam vitae, quas quis dignissimos, odio rerum hic eos nesciunt.
       A voluptatum earum molestiae esse repudiandae, cumque magni ratione sed ducimus. Vero repellendus laboriosam, fugit aliquid qui ipsam ad voluptas libero quia sunt at sapiente suscipit, voluptatem beatae. Accusantium, quidem!
       Reprehenderit perferendis nemo, aperiam nulla illum soluta tempora vero sed animi unde quasi odit, optio maiores temporibus ipsa incidunt eveniet dolores veniam blanditiis. Quae labore magni error necessitatibus quam sequi!
       Voluptatibus culpa saepe ex minus sapiente sunt eos in consequatur. Aut provident nihil impedit nemo nesciunt, accusantium ullam quos rerum, dicta facere reprehenderit mollitia quod laudantium deleniti aliquid consequuntur minima?
       Aliquid ipsum alias porro quidem dicta repellendus doloribus dignissimos eius assumenda, accusamus illum doloremque quibusdam sunt, delectus ullam id quam eveniet est sapiente provident ducimus illo? Maiores, ad! Sunt, aperiam.
       Maxime veniam alias, mollitia laborum, autem illo eos cum doloremque cupiditate vel, suscipit et ipsam placeat distinctio reiciendis provident sequi explicabo ex necessitatibus harum itaque dolore eaque officiis consequuntur. Animi?
       Eveniet temporibus velit facilis magni ex rem sit corrupti? Ratione, eos dolor libero ut minus id odit! Voluptate, itaque, inventore expedita praesentium velit, reprehenderit recusandae obcaecati corporis ipsam accusamus blanditiis!
       Illo quas, culpa perferendis, quos corrupti maxime eum a dolor, mollitia aut minima quae distinctio aliquid harum doloribus sunt ipsum esse sint reprehenderit fugiat delectus sapiente! Id quasi sed odio.
       Deleniti perspiciatis veritatis soluta nam illum error, consequuntur, alias unde molestiae asperiores, obcaecati sed nihil. Mollitia dolorum aspernatur exercitationem ad vitae odit veritatis tenetur totam eligendi eos nihil, reprehenderit quo.
       Consequuntur delectus non et in veritatis repudiandae rem officiis hic impedit excepturi recusandae tempore quae maiores, similique consequatur debitis, iste deleniti dolorem alias esse sapiente fugit vero quibusdam? Aperiam, doloremque.
       Quo, itaque? Laboriosam commodi nam, sequi corporis maiores assumenda blanditiis facilis voluptatem non, officiis id nulla quaerat sunt aliquam. Ab ratione eveniet possimus architecto ducimus harum illum consequuntur necessitatibus praesentium!
       Vel dicta perspiciatis et enim ipsa molestiae nobis repellat quisquam neque officiis nisi distinctio molestias eligendi eum qui itaque, nam corrupti ipsum fuga dignissimos cupiditate at labore. Accusantium, eos cupiditate!
       Dolore totam ipsam reiciendis quam quasi necessitatibus nam temporibus cupiditate saepe ea odit eligendi illum explicabo, molestias officia omnis animi inventore nesciunt maiores expedita sint iste consequuntur hic cum. Eius?
       Obcaecati itaque error, autem vero quo magni in similique laborum quasi? Reiciendis aliquam error sit ipsum, suscipit voluptates voluptatum, blanditiis, ducimus nobis quasi adipisci rem doloremque soluta repudiandae unde maiores?
       Beatae corrupti maiores veniam, sed blanditiis culpa eos, iste quidem corporis soluta perferendis fuga labore praesentium tenetur aperiam numquam tempora dolorum nisi nostrum totam expedita vel odit voluptas! Maiores, eaque.
       Quo autem dolore accusamus perferendis sunt debitis aliquid iusto in asperiores nihil. Amet officiis velit voluptatum dicta sapiente a eum ea similique doloribus, quia fugiat odit hic nobis! Corrupti, exercitationem.
       Quisquam fuga consequuntur nulla autem voluptates non, obcaecati omnis in quasi placeat eaque aliquam laboriosam ex tempora ullam dicta. Maiores cum ut debitis facere, pariatur amet dolor atque voluptate vitae?
       Repudiandae, ducimus rerum, quasi ipsa sit cupiditate harum facilis, ipsum labore accusantium vel aut aliquid quaerat nam placeat blanditiis provident architecto quia pariatur impedit. Ullam, illo dolores! Quam, mollitia repellendus.
       Minus quisquam fugit adipisci nam doloremque labore officia possimus, eos doloribus nihil expedita quis deleniti. Aperiam, aliquid? Ipsa, in a aliquid accusantium magni atque eligendi corrupti laboriosam eius minima eum.
       Quibusdam porro iure tempora possimus ducimus odit doloribus ipsa, sint ipsam doloremque eius. Mollitia error vel, atque voluptatibus, molestias, aliquid placeat autem omnis praesentium rem ipsum quia iusto amet quos.
       Fuga voluptate distinctio dolores pariatur, adipisci minus nihil, delectus quidem temporibus ea est fugit, nisi perspiciatis minima aliquid vero incidunt nemo eos ex voluptatibus nulla labore debitis. Vero, distinctio praesentium?
       Modi aperiam minus explicabo eveniet mollitia sed cumque magni expedita maiores doloribus sapiente quos ad autem necessitatibus facilis ratione blanditiis ducimus, nemo officia molestiae dignissimos culpa ab deserunt. Unde, eligendi.
       Sed, qui. Obcaecati molestiae hic quia aut amet voluptas dolorem commodi cumque, tempora dolor quod ea doloribus quam asperiores ratione aperiam voluptatem rerum ducimus veniam placeat ipsa, quibusdam exercitationem. Recusandae.
       Ex rerum accusantium maxime at saepe. Iste sunt quod consequuntur. Eius dolorem corporis repellat provident ratione odio quidem totam quibusdam accusantium molestias et dolorum iste cum, nulla, perspiciatis suscipit autem!
       Eaque tempora mollitia cum dolorum voluptates! Ipsum voluptates inventore culpa mollitia ad dolorum vitae laudantium odio quam hic, consequuntur doloremque cupiditate velit rerum? Molestias corporis laudantium aliquam consectetur sapiente vel.
       Itaque neque quae unde, odit, temporibus soluta doloremque nulla rem similique magnam debitis sint labore voluptatibus id. Repellat quia ad aperiam vel, magnam esse recusandae molestias harum. Fugiat, iure temporibus!
       Molestiae, nulla. Ut ducimus magni atque sit, illum dolore modi consequatur minima expedita voluptatem nulla? Nihil ipsa doloremque quibusdam optio similique? Porro, amet molestias illo commodi debitis labore laboriosam sapiente.
       Eligendi, ratione amet error numquam ipsum odio perferendis labore ut eum voluptate cumque iusto harum laborum quisquam soluta dolore odit possimus excepturi! Quidem distinctio voluptate quasi dolor vel aperiam! Neque.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim error veritatis expedita magnam asperiores itaque nisi eius, nesciunt libero sequi accusantium dolor voluptatibus modi! Aliquid temporibus nemo reprehenderit hic quidem.
       Ducimus laboriosam, aliquam minus blanditiis omnis tempore ipsum asperiores fuga deleniti eum, minima sapiente doloribus placeat voluptatibus quia odit molestias eveniet libero cumque itaque adipisci hic? Autem, optio consectetur. Ex.
       Obcaecati officiis, est voluptates tempora ipsum quam maxime maiores nulla quae quia! Amet, voluptatem consequuntur quibusdam labore libero vel esse nam necessitatibus minus iste. Distinctio voluptate animi nesciunt adipisci perspiciatis.
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alias esse 
        enim cum aspernatur est tempore neque. Ratione non l
        ibero voluptates! Repellendus ipsa, iste magni ea voluptatibus corrupti ex quibusdam reiciendis? Quản lý tour</p>
      </Row>
      <Row>
      <Container className="mt-4">
        <h2 className="mb-4">Quản lý tour</h2>
        <Table striped bordered hover responsive>
          <thead className="bg-light">
            <tr>
              <th>ID</th>
              <th>Tour Name</th>
              <th>Duration</th>
              <th>Transport</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour.tour_id}>
                <td>{tour.name}</td>
                <td>{tour.duration}</td>
                <td>{tour.transport}</td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(tour.tour_id)}>
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {/* <AddTourArea />
        <Button variant="primary" href="/admin/tours/add">Thêm tour mới</Button> */}
      </Container>
      </Row>
    </Container>
  );
};

export default TourManagement;
