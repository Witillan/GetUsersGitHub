import React, { useEffect, useState } from 'react';
import { Button, Linking, StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';

export default function App() {

  const [route, setRoute] = useState('')
  const [objUser, setObjUser] = useState({})
  const [listUsers, setListUsers] = useState({})
  const [organizations, setOrganizations] = useState({})

  const getMyUser = () => {
    return fetch('https://api.github.com/users/witillan')
      .then((resposta) => resposta.json())
      .then((r) => {
        setObjUser(r)
        return r
      })
      .catch((error) => {
        alert(`Ocorreu um erro ${error.text()} ao buscar o usuário na API do "Github"`);
      })
  }

  const getUsers = () => {
    return fetch('https://api.github.com/users')
      .then((resposta) => resposta.json())
      .then((r) => {
        setListUsers(r)
        return r
      })
      .catch((error) => {
        alert(`Ocorreu um erro ${error.text()} ao buscar os usuários na API do "Github"`);
      })
  }

  const getOrganizations = (login) => {
    return fetch(`https://api.github.com/users/${login}/orgs`)
      .then((resposta) => resposta.json())
      .then((r) => {
        setOrganizations(r)
        return r
      })
      .catch((error) => {
        alert(`Ocorreu um erro ${error.text()} ao buscar o usuário na API do "Github"`);
      })
  }

  useEffect(() => {
    getMyUser()
    getUsers()
  }, [])

  function titleize(text) {
    var loweredText = text.toLowerCase();
    var words = loweredText.split(" ");
    for (var a = 0; a < words.length; a++) {
      var w = words[a];

      var firstLetter = w[0];
      w = firstLetter.toUpperCase() + w.slice(1);

      words[a] = w;
    }
    return words.join(" ");
  }

  const Home = () => {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={[styles.textBold, { fontSize: 25 }]}>Informações do Usuário</Text>
          <View style={[styles.viewText, { marginTop: 20 }]}>
            <img alt='image_user' style={{ width: 70, borderRadius: '100%' }} src={`${objUser.avatar_url}.png`} />
          </View>
          <View style={[styles.viewText, { marginTop: 20 }]}>
            <Text style={styles.textBold}>Usuário: </Text>
            <Text style={styles.text}>{objUser.name}</Text>
          </View>
          <View style={[styles.viewText]}>
            <Text style={styles.textBold}>Qtd Repositórios Publico: </Text>
            <Text style={styles.text}>{objUser.public_repos}</Text>
          </View>
          <Text
            style={[styles.text, styles.link, { padding: 2, }]}
            onPress={() => {
              getOrganizations(objUser.login)
              setRoute('ListagemOrganization')
            }}>
            Organizações
          </Text>
          <Text
            style={[styles.text, styles.link, { padding: 2, }]}
            onPress={() => {
              Linking.openURL(objUser.html_url.toString());
            }}>
            Ir para o Repositório do Usuário
          </Text>
          <View style={{ marginTop: 20 }}>
            <Button title='Outros Usuários' onPress={() => setRoute('ListagemUsuarios')} />
          </View>
        </View>
      </View>
    )
  }

  const Item = ({ item }) => {
    return (
      <View style={styles.cardItem}>
        <View style={[styles.viewText]}>
          <img alt='image_user' style={{ width: 70, borderRadius: '100%' }} src={`${item.avatar_url}.png`} />
          <Text style={[styles.text, { paddingLeft: 10 }]}>{titleize(item.login)}</Text>
          <Text style={[styles.text, { paddingLeft: 10 }]}>{item.public_repos}</Text>
          <Text
            style={[styles.text, styles.link, { paddingLeft: 10 }]}
            onPress={() => {
              getOrganizations(item.login)
              setRoute('ListagemOrganization')
            }}>
            Organizações
          </Text>
          <Text
            style={[styles.text, styles.link, { paddingLeft: 10 }]}
            onPress={() => {
              Linking.openURL(item.html_url.toString());
            }}>
            Link Repositório
          </Text>
        </View>
      </View>
    )
  }

  const ListagemUsuarios = () => {
    return (
      <SafeAreaView style={styles.container}>
        {listUsers.length > 0 ? <FlatList
          style={{ padding: 20 }}
          data={listUsers}
          renderItem={({ item }) => (
            <Item item={item} />
          )}
          keyExtractor={item => item.id}
        /> : <View style={styles.card}><Text>Não possui usuários</Text></View>}
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Button title='Voltar' onPress={() => setRoute('Home')} />
        </View>
      </SafeAreaView>
    )
  }

  const ItemOrganization = ({ item }) => {
    return (
      <View style={styles.cardItem}>
        <View style={[styles.viewText]}>
          <img alt='image_user' style={{ width: 70, borderRadius: '100%' }} src={`${item.avatar_url}.png`} />
          <Text style={[styles.text, { paddingLeft: 10 }]}>{titleize(item.login)}</Text>
          <Text style={[styles.text, { paddingLeft: 10 }]}>{item.description}</Text>
        </View>
      </View>
    )
  }

  const ListagemOrganization = () => {
    return (
      <SafeAreaView style={styles.container}>
        {organizations.length > 0 ?
          <FlatList
            style={{ padding: 20 }}
            data={organizations}
            renderItem={({ item }) => (
              <ItemOrganization item={item} />
            )}
            keyExtractor={item => item.id}
          /> : <View style={styles.card}><Text>Não possui organizações</Text></View>}
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <Button title='Voltar' onPress={() => setRoute('ListagemUsuarios')} />
        </View>
      </SafeAreaView>
    )
  }

  switch (route) {

    case 'Home':
      return <Home />

    case 'ListagemUsuarios':
      return <ListagemUsuarios />

    case 'ListagemOrganization':
      return <ListagemOrganization />

    case '':
      return <Home />

    default:
      return <Home />

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    borderRadius: 5,
    padding: 20,
    backgroundColor: 'green',
    shadowColor: '#000000CC',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardItem: {
    borderRadius: 5,
    padding: 20,
    margin: 10,
    backgroundColor: 'green',
    shadowColor: '#000000CC',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 15,
    color: 'white'
  },
  textBold: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold'
  },
  viewText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  link: {
    color: '#191970'
  }
});
