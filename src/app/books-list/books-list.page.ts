import { Component, OnInit } from '@angular/core';
import { IBook } from '../books/i-book';
import { BooksService } from '../books/books.service';
import { alertController } from '@ionic/core';
import { AlertController } from '@ionic/angular';
import { Utilities } from '../app.utilities';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.page.html',
  styleUrls: ['./books-list.page.scss'],
})
export class BooksListPage implements OnInit {
  public books: IBook[] = [];
  input: string;

  ngOnInit() {
    const searchbar = document.querySelector('ion-searchbar');

    searchbar.addEventListener('ionChange', () => {
      console.log(this.input);
      this.books.forEach(book => {
        book.show = (`${book.id} - ${book.name.toLowerCase()}`).includes(this.input.toLowerCase()) ? 'flex' : 'none';
      });
    });

    searchbar.addEventListener('ionCancel', () => {
      this.books.forEach(book => book.show = 'flex');
    });
  }

  ionViewWillEnter() {
    /*this.booksService.getBooks()
    .subscribe(
      books => this.books = books,
      error => console.error(error),
      () => console.log('Books loaded')
    );*/
    this.books = this.utilities.loadBooks()
                    .sort((a, b) => a.id - b.id);
  }

  constructor(private booksService: BooksService, public alertController: AlertController, private utilities: Utilities) { }

  clickItem(book) {
    console.log(book);
    this.handleButtonClick(book);

  }

  async handleButtonClick(book) {
    const alert = await alertController.create({
      header: `${book.id} - ${book.name}`,
      message: 'Do you have this book?',
      buttons: [
        {
        text: 'No',
        role: 'no',
        cssClass: 'secondary',
        id: 'no-button',
        handler: () => {
          book.owned = false;
          this.utilities.saveBooks(this.books);
          /*this.booksService.updateBook({id: book.id, name: book.name, owned: false, show: book.show})
          .subscribe(
            ok => book.owned = false,
            error => this.showAlert("ERROR", error.name, error.status + " - " + error.statusText)
          );*/
        }
      }, {
        text: 'Yes',
        id: 'yes-button',
        handler: () => {
          book.owned = true;
          this.utilities.saveBooks(this.books);
          /*this.booksService.updateBook({id: book.id, name: book.name, owned: true, show: book.show})
                          .subscribe(
                            _ => book.owned = true,
                            error => this.showAlert("ERROR", error.name, error.status + " - " + error.statusText)
                          );*/
        }
      }],
    });

    await alert.present();
  }

  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header,
      subHeader,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async delete(book) {
    const alert = await alertController.create({
      header: `${book.id} - ${book.name}`,
      message: 'Do you want to delete this book?',
      buttons: [
        {
        text: 'No',
        role: 'no',
        cssClass: 'secondary',
        id: 'no-button'
      }, {
        text: 'Yes',
        id: 'yes-button',
        handler: () => {
          this.books = this.books.filter(b => b.id != book.id);
          this.utilities.saveBooks(this.books);
          /*this.booksService.deleteBook(book.id)
                          .subscribe(
                            _ => this.books = this.books.filter(b => b != book),
                            error => this.showAlert("ERROR", error.name, error.status + " - " + error.statusText)
                          );*/
        }
      }],
    });

    await alert.present();
  }

}
