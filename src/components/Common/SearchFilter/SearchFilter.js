import { Form, InputGroup } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";



const SearchFilter = ({ onSearch, placeholder }) => {
  return (
    <InputGroup >
      <Form.Control
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        className="search-type-light p-2"

      />
      <InputGroup.Text style={{cursor: "pointer"}}>
        <CiSearch />
      </InputGroup.Text>
    </InputGroup>
  );
};

export default SearchFilter;
