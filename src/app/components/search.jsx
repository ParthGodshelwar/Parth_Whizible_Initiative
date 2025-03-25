const [searchTerm, setSearchTerm] = useState("");
const [filteredChildren, setFilteredChildren] = useState(children);

const handleSearch = (event) => {
  const term = event.target.value;
  setSearchTerm(term);
  if (term === "") {
    setFilteredChildren(children);
  } else {
    const filtered = React.Children.toArray(children).filter((child) => {
      console.log("filtered", filtered);
      return (
        typeof child.props.children === "string" &&
        child.props.children.toLowerCase().includes(term.toLowerCase())
      );
    });
    setFilteredChildren(filtered);
  }
};
