import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Db from '../models/db';

export default class Main extends Component {
  async componentWillMount() {
    try {
      await Db.getDb();
      console.log('database loaded');
      this.loadNotes();
    } catch (err) {
      console.log(err);
    }
  }
  async loadNotes() {
    console.log('loading notes');
    const notes = [];

    try {
      const notesRows = await Db.execute('SELECT * FROM Notes', []);
      console.log(`jumlah rows ${notesRows.rows.length}`);
      console.log('adding threads from db to array');
      for (let i = 0; i < notesRows.rows.length; i += 1) {
        const { id, title, detail } = notesRows.rows.item(i);

        const item = {
          id
        };

        console.log(`add thread id ${id}`);
        notes.push(item);
      }
      console.log(notes);
    } catch (err) {
      console.log(err);
    }
  }
  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    );
  }
}
