import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication'; // Importando o pacote de autenticação biométrica
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Tela de Login
function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Função para tentar login biometrico
    const authenticateWithBiometrics = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync(); // Verifica se o dispositivo tem suporte
        if (!hasHardware) {
            Alert.alert('Erro', 'O dispositivo não possui hardware biométrico');
            return;
        }

        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (!supportedTypes.length) {
            Alert.alert('Erro', 'Nenhum tipo de autenticação biométrica suportado');
            return;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Login com biometria',
            fallbackLabel: 'Usar senha',
        });

        if (result.success) {
            navigation.navigate('MainScreen');
        } else {
            Alert.alert('Erro', 'Falha na autenticação biométrica');
        }
    };

    // Função de login com API
    const loginWithAPI = async () => {
        try {
            const response = await fetch(`http://192.168.1.236:3000/login?username=${username}&password=${password}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (data.success) {
                navigation.navigate('MainScreen');
            } else {
                Alert.alert('Erro', data.message);
            }
        } catch (error) {
            Alert.alert('Erro', 'Falha ao conectar à API');
        }
    };

    return (
        <View style={styles.loginContainer}>
            <View style={styles.header}>
                <Text style={styles.welcome}>Olá, visitante!</Text>
                <Text style={styles.instructions}>Faça seu login abaixo</Text>
            </View>
            <TouchableOpacity style={styles.bioButton} onPress={authenticateWithBiometrics}>
                <Text style={styles.bioButtonText}>LOGAR COM SENHA DO CELULAR</Text>
            </TouchableOpacity>
            <View style={styles.inputSection}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite seu usuário"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor="#444"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#444"
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={loginWithAPI}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </View>
    );
}

// Tela Principal
function MainScreen({ navigation }) {
    return (
        <View style={styles.mainContainer}>
            <Text style={styles.mainMessage}>Bem-vindo à Área Principal!</Text>
            <TouchableOpacity
                style={styles.exitButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.exitButtonText}>Sair</Text>
            </TouchableOpacity>
        </View>
    );
}

// Stack Navigator
const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginScreen">
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="MainScreen" component={MainScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    // Estilo da Tela de Login
    loginContainer: {
        flex: 1,
        backgroundColor: '#f0f8ff',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    welcome: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    instructions: {
        fontSize: 16,
        color: '#34495e',
    },
    bioButton: {
        width: '100%',
        backgroundColor: '#3498db',
        padding: 10,  // Pequeno botão de login biométrico
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    bioButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    inputSection: {
        width: '100%',
        marginTop: 20,
    },
    input: {
        width: '100%',
        padding: 12,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#bdc3c7',
        color: '#2c3e50',
    },
    button: {
        width: '100%',
        backgroundColor: '#1abc9c',
        padding: 6,  // Botão pequeno
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },

    // Estilo da Tela Principal
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#34495e',
    },
    mainMessage: {
        fontSize: 24,
        color: '#ecf0f1',
        marginBottom: 20,
    },
    exitButton: {
        padding: 15,
        backgroundColor: '#e74c3c',
        borderRadius: 8,
    },
    exitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});