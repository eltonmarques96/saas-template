import Error from "next/error";

const CustomErrorComponent = (props) => {
	return <Error statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData) => {};

export default CustomErrorComponent;
