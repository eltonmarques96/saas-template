import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
`;

export const PageTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #ffe;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
  text-transform: uppercase !important;
`;

export const FormField = styled.TextInput.attrs({
  placeholderTextColor: "#ddd",
})`
  height: 50px;
  color: #ccc;
  border-color: #ccc;
  border-width: 1px;
  border-radius: 8px;
  padding: 10px 15px;
  margin-bottom: 15px;
`;

export const SubButtonsContainer = styled.View`
  justify-content: space-between;
  flex-direction: row;
  margin: 20px 0px;
`;
export const LinksButtons = styled.Text`
  color: #ddd;
  font-size: 15px;
  text-decoration: underline !important;
`;

export const Subtitle = styled.Text`
  color: #666;
  font-size: 16px;
  text-align: center;
  margin-bottom: 20px;
`;
