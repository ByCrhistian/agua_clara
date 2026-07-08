import { Button, Card, Form, Input, Typography, message} from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { loginRequest } from "../auth/Services";

const { Title } = Typography;

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const iniciarSesion = async (values: {
    usuario: string;
    password: string;
    }) => {
    try {
        const respuesta = await loginRequest({
        usuario: values.usuario,
        contrasena: values.password,
        });

        login(respuesta.usuario);
        navigate("/");
    } catch {
        message.error("Usuario o contraseña incorrectos");
    }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{
                padding: 16,
            }}
        >
            <Card
                style={{
                    width: "90%",
                    maxWidth: 650,
                    borderRadius: 15,
                    boxShadow: "0 15px 35px rgba(0,0,0,.35)",
                }}
                bodyStyle={{
                    padding: "clamp(25px, 5vw, 50px)",
                }}
            >
                <Title
                    level={2}
                    style={{
                        fontSize: "clamp(18px, 5vw, 30px)",

                    }}
                >
                    🔐 Iniciar Sesión - Purificadora
                </Title>

                <Title
                    level={2}
                    style={{
                        fontSize: "clamp(24px, 5vw, 30px)",
                        marginBottom: 70,
                        borderBottom: "2px solid #dfdddd ",
                    }}
                >
                </Title>

                <Form
                    layout="vertical"
                    onFinish={iniciarSesion}
                    autoComplete="off"
                    style={{
                        height: "100%",
                    }}
                >
                    <Form.Item
                        name="usuario"
                        rules={[
                            {
                                required: true,
                                message: "Ingrese su usuario",
                            },
                        ]}
                        style={{
                            margin: 50,
                        }}
                    >
                        <Input
                            size="large"
                            prefix={<UserOutlined />}
                            placeholder="Usuario"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Ingrese su contraseña",
                            },
                        ]}
                        style={{
                            margin: 50,
                        }}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined />}
                            placeholder="Contraseña"
                        />
                    </Form.Item>

                    <Form.Item style={{ margin: 50, boxShadow: "0 15px 35px rgba(0,0,0,.35)",}}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                        >
                            Ingresar al Sistema
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}